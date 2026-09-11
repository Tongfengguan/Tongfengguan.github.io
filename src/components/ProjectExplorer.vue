<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ProjectMap from './ProjectMap.vue'
import AlgorithmGraph from './AlgorithmGraph.vue'
import { projects, technologies, type Project } from '../data/portfolio'
import { algorithmEdges, algorithmTopics, type AlgorithmTopic } from '../data/algorithms'
import { useCodeforces } from '../composables/useCodeforces'

type ExplorerView = 'map' | 'algorithms'

const { profile, status } = useCodeforces()
const compact = ref(false)
const preferredView = ref<ExplorerView | null>(null)
const view = computed(() => preferredView.value ?? 'map')
const selected = ref<Project | null>(null)
const selectedTechnology = ref<string | null>(null)
const selectedAlgorithm = ref<AlgorithmTopic | null>(null)
const technology = computed(() => technologies.find(item => item.name === selectedTechnology.value))
const relatedProjects = computed(() =>
  projects.filter(project =>
    project.tech.some(tech => tech.includes(selectedTechnology.value ?? '\u0000'))
  )
)
const inspectorTitle = ref<HTMLElement | null>(null)
const inspector = ref<HTMLElement | null>(null)
const explorer = ref<HTMLElement | null>(null)
let trigger: HTMLElement | null = null
let media: MediaQueryList | undefined

function updateCompact() {
  compact.value = media?.matches ?? false
}

async function select(project: Project, source: HTMLElement) {
  trigger = source
  selected.value = project
  selectedTechnology.value = null
  selectedAlgorithm.value = null
  await nextTick()
  inspectorTitle.value?.focus({ preventScroll: true })
  if (compact.value) inspector.value?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

async function selectTechnology(name: string, source: HTMLElement) {
  trigger = source
  selected.value = null
  selectedTechnology.value = name
  selectedAlgorithm.value = null
  await nextTick()
  inspectorTitle.value?.focus({ preventScroll: true })
  if (compact.value) inspector.value?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

async function selectAlgorithm(topic: AlgorithmTopic, source: HTMLElement) {
  if (selectedAlgorithm.value?.id === topic.id) {
    trigger = source
    await close()
    return
  }
  const scrollPosition = { left: window.scrollX, top: window.scrollY }
  trigger = source
  selected.value = null
  selectedTechnology.value = null
  selectedAlgorithm.value = topic
  await nextTick()
  window.scrollTo({ ...scrollPosition, behavior: 'auto' })
}

function changeView(next: ExplorerView) {
  preferredView.value = next
  selected.value = null
  selectedTechnology.value = null
  selectedAlgorithm.value = null
  trigger = null
}

async function close() {
  const previous = selected.value
  const previousTechnology = selectedTechnology.value
  const previousAlgorithm = selectedAlgorithm.value
  selected.value = null
  selectedTechnology.value = null
  selectedAlgorithm.value = null
  await nextTick()
  const target =
    trigger?.isConnected && trigger.offsetParent !== null
      ? trigger
      : explorer.value?.querySelector<HTMLElement>(
          view.value === 'algorithms'
            ? `.algorithm-graph [data-algorithm-id="${previousAlgorithm?.id}"]`
            : `.map-shell [data-node-id="${previousTechnology ? 'tech-' + previousTechnology : previous?.id}"]`
        )
  target?.focus({ preventScroll: !compact.value })
}

onMounted(() => {
  media = matchMedia('(max-width: 900px)')
  updateCompact()
  media.addEventListener('change', updateCompact)
})
onUnmounted(() => media?.removeEventListener('change', updateCompact))
</script>

<template>
  <section
    id="explore"
    ref="explorer"
    class="explorer"
    aria-labelledby="explorer-title"
    @keydown.esc="close"
  >
    <div class="explorer-heading">
      <div>
        <h1 id="explorer-title" class="mono eyebrow">
          {{ view === 'algorithms' ? 'Algorithms' : 'Projects' }} / {{ new Date().getFullYear() }}
        </h1>
      </div>
      <div class="view-switch" role="group" aria-label="Explore view">
        <button :aria-pressed="view === 'map'" @click="changeView('map')">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
          >
            <path d="m7 7 10 3M7 7l3 11m7-8-7 8" />
            <circle cx="7" cy="7" r="3" />
            <circle cx="17" cy="10" r="2" />
            <circle cx="10" cy="18" r="2" />
          </svg>
          Map
        </button>
        <button :aria-pressed="view === 'algorithms'" @click="changeView('algorithms')">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
          >
            <path d="M5 5h4v4H5zM15 15h4v4h-4zM7 9v3c0 2 1 3 3 3h5M15 5h4v4h-4" />
          </svg>
          Algorithms
        </button>
      </div>
    </div>
    <div class="explorer-layout">
      <ProjectMap
        v-show="view === 'map'"
        :projects="projects"
        :selected-id="selected?.id ?? null"
        :selected-technology="selectedTechnology"
        @select="select"
        @technology="selectTechnology"
        @home="close"
      />
      <AlgorithmGraph
        v-if="view === 'algorithms'"
        :topics="algorithmTopics"
        :edges="algorithmEdges"
        :selected-id="selectedAlgorithm?.id ?? null"
        @select="selectAlgorithm"
      />
      <aside
        id="project-inspector"
        ref="inspector"
        class="inspector"
        aria-labelledby="inspector-title"
      >
        <div v-if="selected" :key="selected.id" class="detail-content">
          <div class="inspector-top">
            <span class="mono"
              >Project /
              {{
                String(projects.findIndex(project => project.id === selected?.id) + 1).padStart(
                  2,
                  '0'
                )
              }}</span
            ><button class="close-button" aria-label="Close project details" @click="close">
              ×
            </button>
          </div>
          <span class="detail-category mono">{{ selected.category }}</span>
          <h2 id="inspector-title" ref="inspectorTitle" tabindex="-1">{{ selected.title }}</h2>
          <p class="description">{{ selected.description }}</p>
          <h3 class="mono detail-label">Inside the project</h3>
          <ul class="highlights">
            <li v-for="highlight in selected.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
          <h3 class="mono detail-label">Built with</h3>
          <ul class="tech-tags">
            <li v-for="tech in selected.tech" :key="tech">{{ tech }}</li>
          </ul>
          <a class="source-link" :href="selected.url" target="_blank" rel="noopener noreferrer"
            >Explore source <span class="arrow" aria-hidden="true">↗</span></a
          >
          <button class="back-button" @click="close">← Back to exploring</button>
        </div>
        <div v-else-if="technology" :key="technology.name" class="detail-content">
          <div class="inspector-top">
            <span class="mono">Technology / Connections</span
            ><button class="close-button" aria-label="Close technology details" @click="close">
              ×
            </button>
          </div>
          <span class="detail-category mono">Shared building block</span>
          <h2 id="inspector-title" ref="inspectorTitle" tabindex="-1">{{ technology.name }}</h2>
          <p class="description">{{ technology.description }}</p>
          <h3 class="mono detail-label">Explore connected projects</h3>
          <button
            v-for="project in relatedProjects"
            :key="project.id"
            class="related-project"
            @click="select(project, $event.currentTarget as HTMLElement)"
          >
            {{ project.title }} <span aria-hidden="true">↗</span>
          </button>
          <button class="back-button" @click="close">← Back to playing</button>
        </div>
        <div v-else-if="selectedAlgorithm" :key="selectedAlgorithm.id" class="detail-content">
          <div class="inspector-top">
            <span class="mono"
              >Algorithm /
              {{
                String(
                  algorithmTopics.findIndex(topic => topic.id === selectedAlgorithm?.id) + 1
                ).padStart(2, '0')
              }}</span
            ><button class="close-button" aria-label="关闭算法详情" @click="close">×</button>
          </div>
          <span class="detail-category mono"
            >{{ selectedAlgorithm.category }} · {{ selectedAlgorithm.difficulty }}</span
          >
          <h2 id="inspector-title" ref="inspectorTitle" tabindex="-1">
            {{ selectedAlgorithm.title }}
          </h2>
          <p class="description">{{ selectedAlgorithm.description }}</p>
          <h3 class="mono detail-label">关键要点</h3>
          <ul class="highlights">
            <li v-for="point in selectedAlgorithm.keyPoints" :key="point">{{ point }}</li>
          </ul>
          <a
            class="source-link"
            :href="selectedAlgorithm.url"
            target="_blank"
            rel="noopener noreferrer"
            >在 OI Wiki 阅读 <span class="arrow" aria-hidden="true">↗</span></a
          >
          <button class="back-button" @click="close">← 返回算法网络</button>
        </div>
        <div v-else class="overview detail-content">
          <span class="mono inspector-top">{{
            view === 'algorithms' ? 'Algorithm network / Overview' : 'Project details / Overview'
          }}</span>
          <div v-if="view !== 'algorithms'" class="overview-symbol" aria-hidden="true">
            <span /><span /><span />
          </div>
          <h2 v-if="view === 'map'" id="inspector-title">
            Projects and the tools<br />behind them<span>.</span>
          </h2>
          <h2 v-else id="inspector-title">算法知识簇</h2>
          <p v-if="view !== 'algorithms'" class="description">拖动节点，查看项目与技术的关系。</p>
          <p v-else class="description">选择节点，查看关联与要点。</p>
          <div v-if="view === 'map'" class="legend">
            <span><i class="project-key" />Project</span
            ><span><i class="tech-key" />Technology</span
            ><span><i class="line-key" />Connection</span>
          </div>
          <div class="overview-count">
            <strong>{{
              String(
                view === 'algorithms'
                  ? algorithmTopics.length
                  : projects.length + technologies.length + 2
              ).padStart(2, '0')
            }}</strong
            ><span v-if="view === 'algorithms'" class="mono">Algorithms<br />Topics</span
            ><span v-else class="mono">Connected nodes<br />Grab any of them</span>
          </div>
          <p v-if="view === 'map'" class="overview-tip">
            Shuffle changes the arrangement. Reset restores the original view.
          </p>
        </div>
        <a
          class="cf-status"
          href="https://codeforces.com/profile/tfgkk"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="mono">Codeforces <span aria-hidden="true">↗</span></span
          ><span
            ><strong>{{ profile?.rating ?? '—' }}</strong
            ><span>{{ profile?.rank ?? 'Rating unavailable' }}</span></span
          ></a
        >
        <span class="sr-only" role="status">{{ status }}</span>
      </aside>
    </div>
    <div class="explorer-footer mono">
      <template v-if="view === 'algorithms'">
        <span
          ><i /> {{ algorithmTopics.length }} algorithms / {{ algorithmEdges.length }} links</span
        ><span>Based on OI Wiki.</span>
      </template>
      <template v-else>
        <span><i /> {{ projects.length }} projects / Python · Java · Vue</span
        ><span>Projects, links, and small utilities.</span>
      </template>
    </div>
  </section>
</template>

<style scoped>
.explorer {
  padding-top: 2.5rem;
}
.explorer-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0 0 2rem;
}
.eyebrow {
  color: var(--muted);
  font-size: 0.6rem;
}
h1 {
  font-size: clamp(1.65rem, 3vw, 2.3rem);
  font-weight: 400;
  letter-spacing: -0.045em;
}
h1 span,
h2 span {
  color: var(--accent);
}
.view-switch {
  display: flex;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 6px;
}
.view-switch button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 0.9rem;
  border: none;
  border-radius: 3px;
  color: var(--muted);
  background: transparent;
  font-size: 0.75rem;
}
.view-switch button[aria-pressed='true'] {
  background: var(--surface);
  color: var(--ink);
}
.view-switch button:hover {
  color: var(--accent);
}
.view-switch button span {
  font-size: 1rem;
}
.explorer-layout {
  height: min(740px, max(640px, calc(100svh - 230px)));
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: clip;
}
.inspector {
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-left: 1px solid var(--line);
  background: var(--panel);
  scroll-margin-top: 6rem;
}
.detail-content {
  flex: 1;
  animation: enter 240ms var(--ease) both;
}
.inspector-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  min-height: 32px;
  font-size: 0.6rem;
}
.close-button {
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  font-size: 1.3rem;
}
.close-button:hover {
  color: var(--accent);
}
.detail-category {
  display: block;
  color: var(--accent);
  margin: 2rem 0 0.6rem;
  font-size: 0.6rem;
}
h2 {
  font-size: 1.85rem;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.04em;
}
h2:focus {
  outline: none;
}
.description {
  margin: 1.25rem 0;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.85;
}
.detail-label {
  color: var(--muted);
  font-size: 0.6rem;
  margin: 1.5rem 0 0.8rem;
}
.highlights {
  list-style: none;
  font-size: 0.75rem;
}
.highlights li {
  padding-block: 0.5rem;
  border-bottom: 1px solid var(--line);
}
.highlights li::before {
  content: '+';
  color: var(--accent);
  margin-right: 0.75rem;
}
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
}
.tech-tags li {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--line);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
}
.source-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0.65rem 0.85rem;
  margin-top: 2rem;
  background: var(--accent);
  color: var(--bg);
  border-radius: 4px;
  font-size: 0.8rem;
}
.source-link:hover {
  background: var(--accent-hover);
}
.back-button {
  min-height: 44px;
  border: none;
  background: transparent;
  color: var(--muted);
  padding: 0.85rem 0;
  font-size: 0.7rem;
}
.back-button:hover {
  color: var(--accent);
}
.related-project {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 52px;
  padding: 0.75rem 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  font-size: 0.8rem;
}
.related-project:hover {
  color: var(--accent);
}
.overview-symbol {
  display: flex;
  align-items: center;
  width: 90px;
  height: 74px;
  margin-top: 1.25rem;
}
.overview-symbol span {
  width: 30px;
  height: 30px;
  border: 1px solid var(--accent-border);
  border-radius: 50%;
  margin-right: -9px;
}
.overview-symbol span:nth-child(2) {
  width: 42px;
  height: 42px;
  border-color: var(--accent);
}
.legend {
  display: grid;
  gap: 0.6rem;
  margin: 1.75rem 0;
  font-size: 0.7rem;
  color: var(--muted);
}
.legend span {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.legend i {
  display: inline-block;
  width: 12px;
  height: 12px;
}
.project-key {
  border: 1px solid var(--accent);
  border-radius: 50%;
}
.tech-key {
  border: 1px solid var(--muted);
  border-radius: 50%;
  transform: scale(0.4);
}
.line-key {
  border-top: 1px dashed var(--muted);
  height: 1px !important;
}
.overview-count {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--line);
  padding-top: 1.5rem;
}
.overview-count strong {
  font-size: 2.25rem;
  font-weight: 300;
  line-height: 1;
}
.overview-count span {
  font-size: 0.6rem;
  color: var(--muted);
  line-height: 1.8;
}
.overview-tip {
  font-size: 0.65rem;
  color: var(--muted);
  margin: 1.25rem 0 2rem;
}
.cf-status {
  display: grid;
  gap: 0.6rem;
  padding-top: 1.25rem;
  margin-top: 1.5rem;
  border-top: 1px solid var(--line);
}
.cf-status > .mono {
  color: var(--muted);
  font-size: 0.6rem;
}
.cf-status > span:last-child {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}
.cf-status strong {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 400;
}
.cf-status span span {
  font-size: 0.7rem;
  color: var(--muted);
  text-transform: capitalize;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.explorer-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  color: var(--muted);
  font-size: 0.6rem;
}
.explorer-footer i {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 0.5rem;
  border-radius: 50%;
  background: var(--accent);
}
@media (max-width: 900px) {
  .explorer-layout {
    height: auto;
    grid-template-columns: 1fr;
  }
  .inspector {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .overview-symbol {
    display: none;
  }
  .overview h2 {
    margin-top: 1rem;
    font-size: 1.2rem;
  }
  .overview-count,
  .overview .legend {
    display: none;
  }
  .overview-tip {
    margin-bottom: 0;
  }
  .cf-status {
    margin-top: 1rem;
  }
  .explorer-footer > span:last-child {
    display: none;
  }
}
@media (max-width: 600px) {
  .explorer {
    padding-top: 1.5rem;
  }
  .explorer-heading {
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 1.5rem;
  }
  .inspector {
    padding: 1.25rem;
  }
}
</style>
