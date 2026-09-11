<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { AlgorithmEdge, AlgorithmTopic } from '../data/algorithms'

const props = defineProps<{
  topics: AlgorithmTopic[]
  edges: AlgorithmEdge[]
  selectedId: string | null
}>()

const sceneWidth = 2600
const sceneHeight = 1800
const nodeGap = 26
const sourceCenter = { x: 1100, y: 750 }
const layoutCenter = { x: sceneWidth / 2, y: sceneHeight / 2 }
const layoutSpread = { x: 1.18, y: 1.15 }

function nodeFootprint(topic: AlgorithmTopic) {
  return topic.kind === 'hub' ? { width: 174, height: 106 } : { width: 166, height: 64 }
}

function clampForTopic(topic: AlgorithmTopic, point: { x: number; y: number }) {
  const size = nodeFootprint(topic)
  return {
    x: Math.max(size.width / 2, Math.min(sceneWidth - size.width / 2, point.x)),
    y: Math.max(size.height / 2, Math.min(sceneHeight - size.height / 2, point.y)),
  }
}

function createInitialPositions(topics: AlgorithmTopic[]) {
  const layout = Object.fromEntries(
    topics.map(topic => [
      topic.id,
      {
        x: layoutCenter.x + (topic.position.x - sourceCenter.x) * layoutSpread.x,
        y: layoutCenter.y + (topic.position.y - sourceCenter.y) * layoutSpread.y,
      },
    ])
  ) as Record<string, { x: number; y: number }>

  for (let pass = 0; pass < 160; pass += 1) {
    let changed = false
    for (let firstIndex = 0; firstIndex < topics.length; firstIndex += 1) {
      const firstTopic = topics[firstIndex]!
      const first = layout[firstTopic.id]!
      const firstSize = nodeFootprint(firstTopic)
      for (let secondIndex = firstIndex + 1; secondIndex < topics.length; secondIndex += 1) {
        const secondTopic = topics[secondIndex]!
        const second = layout[secondTopic.id]!
        const secondSize = nodeFootprint(secondTopic)
        const deltaX = second.x - first.x
        const deltaY = second.y - first.y
        const overlapX = (firstSize.width + secondSize.width) / 2 + nodeGap - Math.abs(deltaX)
        const overlapY = (firstSize.height + secondSize.height) / 2 + nodeGap - Math.abs(deltaY)
        if (overlapX <= 0 || overlapY <= 0) continue

        changed = true
        const firstWeight =
          firstTopic.kind === 'hub' ? 0.28 : secondTopic.kind === 'hub' ? 0.72 : 0.5
        if (overlapX < overlapY) {
          const direction = deltaX === 0 ? (secondIndex % 2 === 0 ? 1 : -1) : Math.sign(deltaX)
          const separation = overlapX + 1
          Object.assign(
            first,
            clampForTopic(firstTopic, {
              x: first.x - direction * separation * firstWeight,
              y: first.y,
            })
          )
          Object.assign(
            second,
            clampForTopic(secondTopic, {
              x: second.x + direction * separation * (1 - firstWeight),
              y: second.y,
            })
          )
        } else {
          const direction = deltaY === 0 ? (secondIndex % 2 === 0 ? 1 : -1) : Math.sign(deltaY)
          const separation = overlapY + 1
          Object.assign(
            first,
            clampForTopic(firstTopic, {
              x: first.x,
              y: first.y - direction * separation * firstWeight,
            })
          )
          Object.assign(
            second,
            clampForTopic(secondTopic, {
              x: second.x,
              y: second.y + direction * separation * (1 - firstWeight),
            })
          )
        }
      }
    }
    if (!changed) break
  }

  return layout
}

const emit = defineEmits<{
  select: [topic: AlgorithmTopic, trigger: HTMLElement]
}>()

const viewport = ref<HTMLElement | null>(null)
const hovered = ref<string | null>(null)
const focused = ref<string | null>(null)
const query = ref('')
const fit = ref(0.75)
const zoom = ref(1)
const offset = ref({ x: 0, y: 0 })
const dragging = ref(false)
const draggingId = ref<string | null>(null)
const positions = ref(createInitialPositions(props.topics))
const topicById = new Map(props.topics.map(topic => [topic.id, topic]))
const activeId = computed(() => hovered.value ?? focused.value ?? props.selectedId)
const hubs = computed(() => props.topics.filter(topic => topic.kind === 'hub'))
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase())
const matches = computed(() => {
  if (!normalizedQuery.value) return new Set<string>()
  return new Set(
    props.topics
      .filter(topic =>
        [topic.title, topic.category, topic.description, ...topic.keyPoints]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalizedQuery.value)
      )
      .map(topic => topic.id)
  )
})
const neighbors = computed(
  () =>
    new Set(
      props.edges
        .filter(edge => edge.from === activeId.value || edge.to === activeId.value)
        .flatMap(edge => [edge.from, edge.to])
    )
)
const sceneStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate(${offset.value.x}px, ${offset.value.y}px) scale(${fit.value * zoom.value})`,
}))

let resizeObserver: ResizeObserver | undefined
let fitted = false
let suppressedClick: string | null = null
let gesture: {
  id: string | null
  pointer: number
  target: HTMLElement
  start: { x: number; y: number }
  origin: { x: number; y: number }
  moved: boolean
} | null = null

function edgePath(edge: AlgorithmEdge) {
  const start = positions.value[edge.from]
  const end = positions.value[edge.to]
  if (!start || !end) return ''
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const distance = Math.max(1, Math.hypot(deltaX, deltaY))
  const unitX = deltaX / distance
  const unitY = deltaY / distance
  const startInset = topicById.get(edge.from)?.kind === 'hub' ? 58 : 46
  const endInset = topicById.get(edge.to)?.kind === 'hub' ? 58 : 46
  const startX = start.x + unitX * startInset
  const startY = start.y + unitY * startInset
  const endX = end.x - unitX * endInset
  const endY = end.y - unitY * endInset
  return `M ${startX} ${startY} L ${endX} ${endY}`
}

function isConnected(edge: AlgorithmEdge) {
  return edge.from === activeId.value || edge.to === activeId.value
}

function isEdgeHighlighted(edge: AlgorithmEdge) {
  if (activeId.value) return isConnected(edge)
  return Boolean(
    normalizedQuery.value && (matches.value.has(edge.from) || matches.value.has(edge.to))
  )
}

function isEdgeDimmed(edge: AlgorithmEdge) {
  if (activeId.value) return !isConnected(edge)
  return Boolean(
    normalizedQuery.value && !matches.value.has(edge.from) && !matches.value.has(edge.to)
  )
}

function isNodeDimmed(topic: AlgorithmTopic) {
  if (activeId.value) return activeId.value !== topic.id && !neighbors.value.has(topic.id)
  return Boolean(normalizedQuery.value && !matches.value.has(topic.id))
}

function resolveDraggedPosition(id: string, candidate: { x: number; y: number }) {
  const topic = topicById.get(id)
  if (!topic) return candidate
  const size = nodeFootprint(topic)
  const point = clampForTopic(topic, candidate)

  for (let pass = 0; pass < 18; pass += 1) {
    let changed = false
    for (const otherTopic of props.topics) {
      if (otherTopic.id === id) continue
      const other = positions.value[otherTopic.id]
      if (!other) continue
      const otherSize = nodeFootprint(otherTopic)
      const deltaX = point.x - other.x
      const deltaY = point.y - other.y
      const overlapX = (size.width + otherSize.width) / 2 + nodeGap - Math.abs(deltaX)
      const overlapY = (size.height + otherSize.height) / 2 + nodeGap - Math.abs(deltaY)
      if (overlapX <= 0 || overlapY <= 0) continue

      changed = true
      if (overlapX < overlapY) {
        point.x +=
          (deltaX === 0 ? (id > otherTopic.id ? 1 : -1) : Math.sign(deltaX)) * (overlapX + 1)
      } else {
        point.y +=
          (deltaY === 0 ? (id > otherTopic.id ? 1 : -1) : Math.sign(deltaY)) * (overlapY + 1)
      }
      Object.assign(point, clampForTopic(topic, point))
    }
    if (!changed) break
  }

  return point
}

function centeredOffset(topic: AlgorithmTopic) {
  const scale = fit.value * zoom.value
  const point = positions.value[topic.id] ?? topic.position
  return {
    x: Math.max(-1000, Math.min(1000, (sceneWidth / 2 - point.x) * scale)),
    y: Math.max(-700, Math.min(700, (sceneHeight / 2 - point.y) * scale)),
  }
}

async function focusTopic(topic: AlgorithmTopic) {
  offset.value = centeredOffset(topic)
  await nextTick()
  viewport.value
    ?.querySelector<HTMLElement>(`[data-algorithm-id="${topic.id}"]`)
    ?.focus({ preventScroll: true })
}

function focusFirstMatch() {
  const match = props.topics.find(topic => matches.value.has(topic.id))
  if (match) void focusTopic(match)
}

function beginDrag(event: PointerEvent) {
  if (event.button !== 0 || gesture) return
  const node = (event.target as Element).closest<HTMLElement>('[data-algorithm-id]')
  const target = node ?? viewport.value
  if (!target) return
  const id = node?.dataset.algorithmId ?? null
  suppressedClick = null
  gesture = {
    id,
    pointer: event.pointerId,
    target,
    start: { x: event.clientX, y: event.clientY },
    origin: { ...(id ? positions.value[id]! : offset.value) },
    moved: false,
  }
  target.setPointerCapture(event.pointerId)
}

function moveDrag(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.pointer) return
  const deltaX = event.clientX - gesture.start.x
  const deltaY = event.clientY - gesture.start.y
  if (!gesture.moved && Math.hypot(deltaX, deltaY) < 4) return
  gesture.moved = true
  dragging.value = true
  draggingId.value = gesture.id
  if (gesture.id) {
    positions.value[gesture.id] = resolveDraggedPosition(gesture.id, {
      x: gesture.origin.x + deltaX / (fit.value * zoom.value),
      y: gesture.origin.y + deltaY / (fit.value * zoom.value),
    })
    return
  }
  offset.value = {
    x: Math.max(-1000, Math.min(1000, gesture.origin.x + deltaX)),
    y: Math.max(-700, Math.min(700, gesture.origin.y + deltaY)),
  }
}

function endDrag(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.pointer) return
  if (gesture.moved) suppressedClick = gesture.id
  const { target, pointer } = gesture
  gesture = null
  dragging.value = false
  draggingId.value = null
  if (target.hasPointerCapture(pointer)) target.releasePointerCapture(pointer)
}

function activate(topic: AlgorithmTopic, event: MouseEvent) {
  if (suppressedClick === topic.id && event.detail !== 0) {
    event.preventDefault()
    suppressedClick = null
    return
  }
  emit('select', topic, event.currentTarget as HTMLElement)
}

function nudge(topic: AlgorithmTopic, event: KeyboardEvent) {
  const directions: Record<string, { x: number; y: number }> = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
  }
  const direction = directions[event.key]
  if (!direction) return
  event.preventDefault()
  event.stopPropagation()
  const distance = event.shiftKey ? 40 : 16
  const point = positions.value[topic.id]!
  positions.value[topic.id] = resolveDraggedPosition(topic.id, {
    x: point.x + direction.x * distance,
    y: point.y + direction.y * distance,
  })
}

function resetView() {
  zoom.value = 1
  query.value = ''
  positions.value = createInitialPositions(props.topics)
  const home = props.topics.find(topic => topic.id === 'dynamic-programming')
  offset.value = home ? centeredOffset(home) : { x: 0, y: 0 }
}

onMounted(() => {
  if (!viewport.value) return
  resizeObserver = new ResizeObserver(() => {
    if (!viewport.value?.clientWidth || !viewport.value.clientHeight) return
    const minimum = viewport.value.clientWidth < 600 ? 0.74 : 0.68
    fit.value = Math.max(
      minimum,
      Math.min(viewport.value.clientWidth / sceneWidth, viewport.value.clientHeight / sceneHeight)
    )
    if (!fitted) {
      fitted = true
      const home = props.topics.find(topic => topic.id === 'dynamic-programming')
      if (home) offset.value = centeredOffset(home)
    }
  })
  resizeObserver.observe(viewport.value)
})

onUnmounted(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="algorithm-graph">
    <div class="graph-caption">
      <span class="mono">Algorithm network</span>
      <a href="https://oi-wiki.org/" target="_blank" rel="noopener noreferrer">
        参考 OI Wiki <span aria-hidden="true">↗</span>
      </a>
    </div>
    <div class="graph-toolbar">
      <form class="algorithm-search" role="search" @submit.prevent="focusFirstMatch">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
        <label class="sr-only" for="algorithm-search">搜索算法</label>
        <input
          id="algorithm-search"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="搜索算法"
          @keydown.esc.stop="query = ''"
        />
        <span class="mono" aria-live="polite">
          {{ normalizedQuery ? `${matches.size} matches` : `${topics.length} topics` }}
        </span>
      </form>
      <nav class="hub-jumps" aria-label="算法分类跳转">
        <button v-for="hub in hubs" :key="hub.id" type="button" @click="focusTopic(hub)">
          {{ hub.title }}
        </button>
      </nav>
    </div>
    <div
      ref="viewport"
      class="graph-viewport"
      :class="{ dragging }"
      role="group"
      aria-label="算法关系网"
      aria-describedby="algorithm-help"
      @pointerdown="beginDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @dragstart.prevent
    >
      <div class="graph-scene" :style="sceneStyle">
        <svg
          class="algorithm-edges"
          :viewBox="`0 0 ${sceneWidth} ${sceneHeight}`"
          fill="none"
          aria-hidden="true"
        >
          <path
            v-for="edge in edges"
            :key="`${edge.from}-${edge.to}`"
            :d="edgePath(edge)"
            :class="{
              active: isEdgeHighlighted(edge),
              dimmed: isEdgeDimmed(edge),
            }"
          />
        </svg>
        <button
          v-for="topic in topics"
          :key="topic.id"
          class="algorithm-node"
          :class="{
            active: activeId === topic.id,
            related: activeId && neighbors.has(topic.id) && activeId !== topic.id,
            dimmed: isNodeDimmed(topic),
            'search-match': normalizedQuery && matches.has(topic.id),
            selected: selectedId === topic.id,
            grabbed: draggingId === topic.id,
            [topic.kind]: true,
          }"
          :style="{
            left: `${positions[topic.id]!.x}px`,
            top: `${positions[topic.id]!.y}px`,
            '--algorithm-color': `var(--algorithm-${topic.tone})`,
          }"
          :data-algorithm-id="topic.id"
          :aria-label="`查看算法：${topic.title}`"
          :aria-pressed="selectedId === topic.id"
          aria-controls="project-inspector"
          @pointerenter="hovered = topic.id"
          @pointerleave="hovered = null"
          @focus="focused = topic.id"
          @blur="focused = null"
          @click="activate(topic, $event)"
          @keydown="nudge(topic, $event)"
        >
          <span class="node-dot" aria-hidden="true" />
          <strong>{{ topic.title }}</strong>
          <small>{{ topic.category }}</small>
        </button>
      </div>
    </div>
    <div class="graph-bottom">
      <p id="algorithm-help">搜索、拖动或选择节点。<small>再次点击取消 · 拖动空白处移动</small></p>
      <div class="graph-controls" role="group" aria-label="算法网络视图控制">
        <button
          aria-label="缩小算法网络"
          :disabled="zoom <= 0.8"
          @click="zoom = Math.max(0.8, +(zoom - 0.1).toFixed(1))"
        >
          −
        </button>
        <output class="mono" aria-label="算法网络缩放比例">{{ Math.round(zoom * 100) }}%</output>
        <button
          aria-label="放大算法网络"
          :disabled="zoom >= 1.4"
          @click="zoom = Math.min(1.4, +(zoom + 0.1).toFixed(1))"
        >
          +
        </button>
        <button @click="resetView">Reset</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-graph {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  background: var(--map-glow);
  animation: enter 300ms var(--ease) both;
}
.graph-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.4rem;
  color: var(--muted);
}
.graph-caption .mono {
  font-size: 0.6rem;
}
.graph-caption a {
  color: var(--accent);
  font-size: 0.7rem;
}
.graph-toolbar {
  display: grid;
  gap: 0.7rem;
  padding: 0 1.2rem 1rem;
  border-bottom: 1px solid var(--line);
}
.algorithm-search {
  display: grid;
  grid-template-columns: 18px minmax(9rem, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
  min-height: 44px;
  padding: 0 0.8rem;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: color-mix(in srgb, var(--panel) 82%, transparent);
}
.algorithm-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--avatar-glow);
}
.algorithm-search svg {
  width: 16px;
  stroke-width: 1.5;
}
.algorithm-search input {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 0.75rem;
}
.algorithm-search input::placeholder {
  color: var(--muted);
}
.algorithm-search .mono {
  color: var(--muted);
  font-size: 0.54rem;
}
.hub-jumps {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 0.15rem;
  scrollbar-width: thin;
}
.hub-jumps button {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 0.75rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 0.66rem;
}
.hub-jumps button:hover,
.hub-jumps button:focus-visible {
  border-color: var(--accent);
  color: var(--accent);
}
.graph-viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
}
.graph-viewport.dragging {
  cursor: grabbing;
}
.graph-scene {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2600px;
  height: 1800px;
  transform-origin: center;
  user-select: none;
}
.algorithm-edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.algorithm-edges path {
  stroke: var(--connection);
  stroke-width: 1.2;
  stroke-linecap: round;
  transition:
    stroke 180ms var(--ease),
    stroke-width 180ms var(--ease),
    opacity 180ms var(--ease);
}
.algorithm-edges path.active {
  stroke: var(--connection-active);
  stroke-width: 2.4;
}
.algorithm-edges path.dimmed {
  opacity: 0.08;
}
.algorithm-node {
  position: absolute;
  display: grid;
  min-width: 108px;
  min-height: 44px;
  max-width: 150px;
  gap: 0.2rem;
  padding: 0.65rem 0.85rem 0.65rem 1.4rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--node-surface);
  box-shadow: 0 4px 0 var(--node-shadow);
  text-align: left;
  transform: translate(-50%, -50%);
  cursor: grab;
  touch-action: none;
  transition:
    opacity 180ms var(--ease),
    border-color 180ms var(--ease),
    background-color 180ms var(--ease),
    transform 180ms var(--ease),
    box-shadow 180ms var(--ease);
  z-index: 1;
}
.algorithm-node strong {
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.algorithm-node small {
  color: var(--muted);
  font-size: 0.52rem;
  white-space: nowrap;
}
.node-dot {
  position: absolute;
  left: 0.72rem;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--algorithm-color);
  transform: translateY(-50%);
}
.algorithm-node.active,
.algorithm-node.related,
.algorithm-node.selected,
.algorithm-node.search-match {
  border-color: var(--algorithm-color);
  background: var(--panel);
  z-index: 2;
}
.algorithm-node.active {
  box-shadow:
    0 4px 0 var(--node-shadow),
    0 0 0 4px var(--avatar-glow);
  transform: translate(-50%, calc(-50% - 4px));
}
.algorithm-node.selected {
  box-shadow:
    0 4px 0 var(--node-shadow),
    0 0 0 2px var(--algorithm-color);
}
.algorithm-node.dimmed {
  opacity: 0.12;
}
.algorithm-node.hub {
  min-width: 112px;
  min-height: 82px;
  place-content: center;
  padding: 0.8rem 1rem;
  border: 1.5px solid var(--algorithm-color);
  border-radius: 28px;
  background: var(--panel);
  text-align: center;
}
.algorithm-node.hub .node-dot {
  left: 50%;
  top: 0.65rem;
  transform: translateX(-50%);
}
.algorithm-node.hub strong {
  margin-top: 0.35rem;
  font-size: 0.88rem;
}
.algorithm-node.variant {
  min-width: 96px;
  padding-block: 0.5rem;
  border-style: dashed;
}
.algorithm-node.grabbed {
  cursor: grabbing;
  z-index: 4;
}
.graph-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  border-top: 1px solid var(--line);
}
.graph-bottom p {
  font-size: 0.72rem;
}
.graph-bottom small {
  display: block;
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.58rem;
}
.graph-controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
}
.graph-controls button {
  min-width: 34px;
  min-height: 44px;
  padding-inline: 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  font-size: 0.68rem;
}
.graph-controls button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
.graph-controls output {
  width: 38px;
  color: var(--muted);
  text-align: center;
  font-size: 0.56rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (max-width: 900px) {
  .algorithm-graph {
    min-height: 620px;
  }
  .graph-viewport {
    min-height: 500px;
  }
}
@media (max-width: 600px) {
  .graph-caption,
  .graph-bottom,
  .graph-toolbar {
    padding-inline: 1rem;
  }
  .algorithm-search {
    grid-template-columns: 18px minmax(0, 1fr);
  }
  .algorithm-search .mono {
    display: none;
  }
  .hub-jumps button {
    min-height: 44px;
  }
  .graph-bottom {
    align-items: flex-start;
    flex-direction: column;
  }
  .graph-controls {
    align-self: flex-end;
  }
}
</style>
