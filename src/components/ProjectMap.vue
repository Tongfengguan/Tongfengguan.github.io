<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { technologies, type Project } from '../data/portfolio'

const props = defineProps<{
  projects: Project[]
  selectedId: string | null
  selectedTechnology: string | null
}>()
const emit = defineEmits<{
  select: [project: Project, trigger: HTMLElement]
  technology: [name: string, trigger: HTMLElement]
  home: []
}>()
type Point = { x: number; y: number }
type Node = {
  id: string
  label: string
  kind: 'origin' | 'project' | 'technology' | 'link'
  position: Point
  color: string
  url?: string
}
const colors = ['var(--node-a)', 'var(--node-b)', 'var(--node-c)'] as const
const nodes: Node[] = [
  { id: 'home', label: 'TFGKK', kind: 'origin', position: { x: 425, y: 345 }, color: colors[0] },
  ...props.projects.map((project, index) => ({
    id: project.id,
    label: project.title,
    kind: 'project' as const,
    position: project.position,
    color: colors[index % colors.length] ?? colors[0],
  })),
  ...technologies.map((technology, index) => ({
    id: 'tech-' + technology.name,
    label: technology.name,
    kind: 'technology' as const,
    position: technology.position,
    color: index < 4 ? colors[0] : colors[1],
  })),
  {
    id: 'codeforces',
    label: 'Codeforces ↗',
    kind: 'link',
    position: { x: 205, y: 500 },
    color: colors[2],
    url: 'https://codeforces.com/profile/tfgkk',
  },
]
const edges = [
  ...props.projects.map(project => ({ from: 'home', to: project.id })),
  { from: 'home', to: 'codeforces' },
  ...props.projects.flatMap(project =>
    technologies
      .filter(technology => project.tech.some(tech => tech.includes(technology.name)))
      .map(technology => ({ from: project.id, to: 'tech-' + technology.name }))
  ),
]
const positions = ref<Record<string, Point>>(
  Object.fromEntries(nodes.map(node => [node.id, { ...node.position }]))
)
const viewport = ref<HTMLElement | null>(null)
const fit = ref(1)
const zoom = ref(1)
const offset = ref({ x: 0, y: 0 })
const hovered = ref<string | null>(null)
const draggingId = ref<string | null>(null)
const dragging = ref(false)
const explored = ref(new Set<string>())
const announcement = ref('')
const active = computed(
  () =>
    draggingId.value ??
    hovered.value ??
    (props.selectedTechnology ? 'tech-' + props.selectedTechnology : props.selectedId)
)
const neighbors = computed(
  () =>
    new Set(
      edges
        .filter(edge => edge.from === active.value || edge.to === active.value)
        .flatMap(edge => [edge.from, edge.to])
    )
)
const sceneStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate(${offset.value.x}px, ${offset.value.y}px) scale(${fit.value * zoom.value})`,
}))
const avatarSrc = import.meta.env.BASE_URL + 'avatar.png'
let resizeObserver: ResizeObserver | undefined
let animationFrame = 0
let suppressedClick: string | null = null
let gesture: {
  id: string | null
  pointer: number
  target: HTMLElement
  start: Point
  origin: Point
  moved: boolean
} | null = null

function bounded(point: Point): Point {
  return { x: Math.max(90, Math.min(900, point.x)), y: Math.max(55, Math.min(575, point.y)) }
}

function edgePath(edge: { from: string; to: string }) {
  const start = positions.value[edge.from]!
  const end = positions.value[edge.to]!
  const bend = Math.min(65, Math.hypot(end.x - start.x, end.y - start.y) * 0.15)
  return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - bend} ${end.x} ${end.y}`
}

function animatePositions(target: Record<string, Point>) {
  cancelAnimationFrame(animationFrame)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    positions.value = target
    return
  }
  const start = Object.fromEntries(nodes.map(node => [node.id, { ...positions.value[node.id]! }]))
  const started = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / 600)
    const eased = 1 - Math.pow(1 - progress, 3)
    positions.value = Object.fromEntries(
      nodes.map(node => [
        node.id,
        {
          x: start[node.id]!.x + (target[node.id]!.x - start[node.id]!.x) * eased,
          y: start[node.id]!.y + (target[node.id]!.y - start[node.id]!.y) * eased,
        },
      ])
    )
    if (progress < 1) animationFrame = requestAnimationFrame(step)
    else animationFrame = 0
  }
  animationFrame = requestAnimationFrame(step)
}

function reset() {
  zoom.value = 1
  offset.value = { x: 0, y: 0 }
  animatePositions(Object.fromEntries(nodes.map(node => [node.id, { ...node.position }])))
  announcement.value = 'Original layout restored.'
}

function shuffle() {
  const target = Object.fromEntries(nodes.map(node => [node.id, { ...node.position }]))
  for (const kind of ['project', 'technology']) {
    const group = nodes.filter(node => node.kind === kind)
    const shift = 1 + Math.floor(Math.random() * (group.length - 1))
    group.forEach((node, index) => {
      target[node.id] = { ...group[(index + shift) % group.length]!.position }
    })
  }
  offset.value = { x: 0, y: 0 }
  zoom.value = 1
  animatePositions(target)
  announcement.value = 'New arrangement. Connections are preserved.'
}

function beginDrag(event: PointerEvent) {
  if (event.button !== 0 || gesture) return
  cancelAnimationFrame(animationFrame)
  animationFrame = 0
  const node = (event.target as Element).closest<HTMLElement>('[data-node-id]')
  const target = node ?? viewport.value
  if (!target) return
  const id = node?.dataset.nodeId ?? null
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
  const delta = { x: event.clientX - gesture.start.x, y: event.clientY - gesture.start.y }
  if (!gesture.moved && Math.hypot(delta.x, delta.y) < 5) return
  gesture.moved = true
  dragging.value = true
  draggingId.value = gesture.id
  if (gesture.id) {
    positions.value[gesture.id] = bounded({
      x: gesture.origin.x + delta.x / (fit.value * zoom.value),
      y: gesture.origin.y + delta.y / (fit.value * zoom.value),
    })
  } else {
    offset.value = {
      x: Math.max(-450, Math.min(450, gesture.origin.x + delta.x)),
      y: Math.max(-320, Math.min(320, gesture.origin.y + delta.y)),
    }
  }
}

function endDrag(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.pointer) return
  if (gesture.moved) {
    suppressedClick = gesture.id
    announcement.value = gesture.id
      ? 'Node moved. Use Reset to restore the layout.'
      : 'Canvas moved.'
  }
  const { target, pointer } = gesture
  gesture = null
  dragging.value = false
  draggingId.value = null
  if (target.hasPointerCapture(pointer)) target.releasePointerCapture(pointer)
}

function activate(node: Node, event: MouseEvent) {
  if (suppressedClick === node.id && event.detail !== 0) {
    event.preventDefault()
    suppressedClick = null
    return
  }
  explored.value.add(node.id)
  const trigger = event.currentTarget as HTMLElement
  if (node.kind === 'project') {
    const project = props.projects.find(project => project.id === node.id)
    if (project) emit('select', project, trigger)
  } else if (node.kind === 'technology') emit('technology', node.label, trigger)
  else if (node.kind === 'origin') emit('home')
}

function nudge(node: Node, event: KeyboardEvent) {
  const directions: Record<string, Point> = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
  }
  const direction = directions[event.key]
  if (!direction) return
  event.preventDefault()
  event.stopPropagation()
  cancelAnimationFrame(animationFrame)
  const distance = event.shiftKey ? 40 : 16
  const point = positions.value[node.id]!
  positions.value[node.id] = bounded({
    x: point.x + direction.x * distance,
    y: point.y + direction.y * distance,
  })
  announcement.value = node.label + ' moved.'
}

function revealFocused(event: FocusEvent) {
  if (gesture || !viewport.value) return
  const target = event.target as HTMLElement
  if (!target.dataset.nodeId) return
  hovered.value = target.dataset.nodeId
  const bounds = target.getBoundingClientRect()
  const visible = viewport.value.getBoundingClientRect()
  if (
    bounds.left < visible.left ||
    bounds.right > visible.right ||
    bounds.top < visible.top ||
    bounds.bottom > visible.bottom
  ) {
    zoom.value = 1
    offset.value = { x: 0, y: 0 }
  }
}

onMounted(() => {
  if (!viewport.value) return
  resizeObserver = new ResizeObserver(() => {
    if (viewport.value?.clientWidth && viewport.value.clientHeight)
      fit.value = Math.min(viewport.value.clientWidth / 1000, viewport.value.clientHeight / 650)
  })
  resizeObserver.observe(viewport.value)
})
onUnmounted(() => {
  resizeObserver?.disconnect()
  cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div class="map-shell">
    <div class="map-caption">
      <span class="mono">Project connections</span
      ><span class="discovery mono">{{ explored.size }} / {{ nodes.length }} viewed</span>
    </div>
    <div
      ref="viewport"
      class="map-viewport"
      :class="{ dragging }"
      role="group"
      aria-label="Interactive project connections"
      aria-describedby="map-help"
      @pointerdown="beginDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @focusin="revealFocused"
      @dragstart.prevent
    >
      <div class="map-scene" :style="sceneStyle">
        <svg class="connections" viewBox="0 0 1000 650" fill="none" aria-hidden="true">
          <path
            v-for="edge in edges"
            :key="edge.from + edge.to"
            :d="edgePath(edge)"
            :class="{
              active: active === edge.from || active === edge.to,
              faded: active && active !== edge.from && active !== edge.to,
            }"
          />
        </svg>
        <component
          :is="node.url ? 'a' : 'button'"
          v-for="node in nodes"
          :key="node.id"
          class="map-node"
          :class="[
            node.kind,
            {
              selected: selectedId === node.id || selectedTechnology === node.label,
              related: neighbors.has(node.id),
              faded: active && active !== node.id && !neighbors.has(node.id),
              grabbed: draggingId === node.id,
              visited: explored.has(node.id),
            },
          ]"
          :style="{
            left: positions[node.id]!.x + 'px',
            top: positions[node.id]!.y + 'px',
            '--node-color': node.color,
          }"
          :data-node-id="node.id"
          :data-project-id="node.kind === 'project' ? node.id : undefined"
          :href="node.url"
          :target="node.url ? '_blank' : undefined"
          :rel="node.url ? 'noopener noreferrer' : undefined"
          :aria-label="node.kind === 'origin' ? 'Return to overview' : 'Explore ' + node.label"
          :aria-pressed="
            node.url ? undefined : selectedId === node.id || selectedTechnology === node.label
          "
          :aria-controls="
            node.kind === 'project' || node.kind === 'technology' ? 'project-inspector' : undefined
          "
          @pointerenter="hovered = node.id"
          @pointerleave="hovered = null"
          @blur="hovered = null"
          @click="activate(node, $event)"
          @keydown="nudge(node, $event)"
        >
          <template v-if="node.kind === 'origin'"
            ><span class="avatar-ring"
              ><img :src="avatarSrc" alt="" width="60" height="60" draggable="false" /></span
            ><strong>TFGKK<span>.</span></strong
            ><small>Personal homepage</small></template
          >
          <template v-else-if="node.kind === 'technology'"
            ><span class="tech-dot" /><strong>{{ node.label }}</strong></template
          >
          <template v-else
            ><span class="node-symbol">{{
              node.kind === 'link'
                ? '&lt;/&gt;'
                : String(projects.findIndex(project => project.id === node.id) + 1).padStart(2, '0')
            }}</span
            ><strong>{{ node.label }}</strong
            ><small>{{ node.kind === 'link' ? 'Algorithms' : 'Open project ↗' }}</small></template
          >
        </component>
      </div>
    </div>
    <div class="map-bottom">
      <p id="map-help">
        Move any node to adjust the view.<small
          >Select for details · Arrow keys move focused nodes</small
        >
      </p>
      <div class="map-controls" role="group" aria-label="Playground controls">
        <button class="shuffle" @click="shuffle">Shuffle</button>
        <button
          aria-label="Zoom out"
          :disabled="zoom <= 0.8"
          @click="zoom = Math.max(0.8, +(zoom - 0.2).toFixed(1))"
        >
          −
        </button>
        <output class="mono" aria-label="Zoom level">{{ Math.round(zoom * 100) }}%</output>
        <button
          aria-label="Zoom in"
          :disabled="zoom >= 2.4"
          @click="zoom = Math.min(2.4, +(zoom + 0.2).toFixed(1))"
        >
          +
        </button>
        <button @click="reset">Reset</button>
      </div>
    </div>
    <span class="sr-only" role="status">{{ announcement }}</span>
  </div>
</template>

<style scoped>
.map-shell {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: var(--map-glow);
  animation: enter 400ms var(--ease) both;
}
.map-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  color: var(--muted);
}
.map-caption .mono {
  font-size: 0.6rem;
}
.discovery {
  color: var(--accent);
  border: 1px solid var(--accent-border);
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
}
.map-viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
}
.map-scene {
  position: absolute;
  width: 1000px;
  height: 650px;
  top: 50%;
  left: 50%;
  transform-origin: center;
  user-select: none;
}
.connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.connections path {
  stroke: var(--connection);
  stroke-width: 1.3;
  transition:
    stroke 180ms,
    opacity 180ms;
}
.connections path.active {
  stroke: var(--connection-active);
  stroke-width: 2;
}
.faded {
  opacity: 0.28;
}
.map-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--ink);
  cursor: grab;
  touch-action: none;
  transition: opacity 180ms;
  z-index: 1;
}
.map-node strong {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
.map-node small {
  font-size: 10px;
  color: var(--muted);
}
.map-node.project {
  min-width: 185px;
}
.map-node strong,
.map-node small {
  background: var(--node-label);
  padding-inline: 4px;
  border-radius: 3px;
}
.node-symbol {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border: 1px solid var(--node-color);
  color: var(--node-color);
  background: var(--node-surface);
  border-radius: 19px;
  font: 17px var(--font-mono);
  box-shadow: 0 7px 0 var(--node-shadow);
  transition: transform 240ms cubic-bezier(0.2, 1.6, 0.5, 1);
}
.map-node:hover .node-symbol,
.map-node.related .node-symbol,
.map-node.selected .node-symbol {
  transform: translateY(-4px) rotate(-6deg);
}
.map-node.selected strong,
.map-node.related strong {
  color: var(--node-color);
}
.map-node.grabbed {
  z-index: 3;
  cursor: grabbing;
}
.grabbed .node-symbol {
  transform: scale(1.13) rotate(8deg);
}
.dragging {
  cursor: grabbing;
}
.technology {
  flex-direction: row;
  gap: 9px;
  padding: 12px 15px;
  min-height: 46px;
  border: 1px solid var(--control-line);
  border-radius: 999px;
  background: var(--tech-surface);
}
.technology strong {
  background: none;
  padding: 0;
  font: 12px var(--font-mono);
}
.technology.related,
.technology:hover,
.technology.selected {
  border-color: var(--node-color);
}
.tech-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--node-color);
}
.avatar-ring {
  border: 1px solid var(--accent-border);
  padding: 13px;
  border-radius: 50%;
  background: var(--avatar-surface);
  box-shadow: 0 0 0 12px var(--avatar-glow);
  transition: transform 240ms cubic-bezier(0.2, 1.6, 0.5, 1);
}
.avatar-ring img {
  display: block;
  border-radius: 50%;
}
.origin:hover .avatar-ring,
.origin.grabbed .avatar-ring {
  transform: rotate(12deg) scale(1.07);
}
.origin strong {
  font-size: 26px;
  letter-spacing: -0.06em;
}
.origin strong span {
  color: var(--accent);
}
.visited::after {
  content: '';
  position: absolute;
  right: 5px;
  top: 5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--node-color);
}
.map-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--line);
}
.map-bottom p {
  font-size: 0.75rem;
}
.map-bottom small {
  display: block;
  color: var(--muted);
  font-size: 0.6rem;
  margin-top: 0.3rem;
}
.map-controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
}
.map-controls button {
  min-width: 34px;
  min-height: 40px;
  padding-inline: 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  font-size: 0.7rem;
}
.map-controls button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
.map-controls .shuffle {
  color: var(--accent);
  margin-right: 6px;
}
.map-controls output {
  width: 35px;
  text-align: center;
  color: var(--muted);
  font-size: 0.6rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@media (max-width: 1200px) {
  .map-bottom {
    flex-wrap: wrap;
  }
}
@media (max-width: 900px) {
  .map-shell {
    min-height: 500px;
  }
  .map-viewport {
    min-height: 360px;
  }
  .map-caption {
    padding: 1rem;
  }
}
</style>
