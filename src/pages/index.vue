<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import ProjectExplorer from '../components/ProjectExplorer.vue'
import LinksSection from '../components/LinksSection.vue'
import { linkGroups, personalProfile, projects } from '../data/portfolio'
import { algorithmTopics } from '../data/algorithms'
import { useTheme } from '../composables/useTheme'

const page = ref<HTMLElement | null>(null)
const avatarSrc = import.meta.env.BASE_URL + 'avatar.png'
const { theme, toggle: toggleTheme } = useTheme()
const ToolboxSection = defineAsyncComponent(() => import('../components/ToolboxSection.vue'))
const toolsVisible = ref(false)
const toolbox = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let toolsObserver: IntersectionObserver | undefined

onMounted(() => {
  if ('IntersectionObserver' in window && toolbox.value) {
    toolsObserver = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          toolsVisible.value = true
          toolsObserver?.disconnect()
        }
      },
      { rootMargin: '250px' }
    )
    toolsObserver.observe(toolbox.value)
  } else toolsVisible.value = true
  if (
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    return
  }

  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.remove('reveal-pending')
        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.08 }
  )

  page.value?.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight) return
    element.classList.add('reveal-pending')
    observer?.observe(element)
  })
})

onUnmounted(() => {
  observer?.disconnect()
  toolsObserver?.disconnect()
})
</script>

<template>
  <div id="top" ref="page" class="page-shell">
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-nav">
      <a class="brand" href="#top" aria-label="TFGKK home">
        <img :src="avatarSrc" alt="TFGKK's little ghost avatar" width="30" height="30" />
        <span>tfgkk <span class="brand-mark">/ home</span></span>
      </a>
      <div class="nav-cluster">
        <nav aria-label="Page sections">
          <a href="#explore">Projects</a>
          <a href="#tools" @click="toolsVisible = true">Tools</a>
          <a href="#resources">Links</a>
          <a href="mailto:1316187067@qq.com">Contact <span aria-hidden="true">↗</span></a>
        </nav>
        <button
          class="theme-toggle"
          type="button"
          :aria-label="theme === 'light' ? '切换到夜间主题' : '切换到日间主题'"
          :title="theme === 'light' ? '夜间主题' : '日间主题'"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'light'" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
          </svg>
          <svg v-else aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            />
          </svg>
        </button>
      </div>
    </header>

    <main id="content" tabindex="-1">
      <section class="identity" aria-labelledby="identity-title">
        <div class="identity-copy">
          <span class="mono">Personal homepage / {{ new Date().getFullYear() }}</span>
          <h1 id="identity-title">{{ personalProfile.headline }}</h1>
          <p>{{ personalProfile.summary }}</p>
          <ul class="focus-list" aria-label="主要方向">
            <li v-for="item in personalProfile.focus" :key="item">{{ item }}</li>
          </ul>
          <nav class="identity-links" aria-label="个人链接">
            <a
              v-for="link in personalProfile.links"
              :key="link.title"
              :href="link.url"
              :target="link.url.startsWith('https:') ? '_blank' : undefined"
              rel="noopener noreferrer"
            >
              {{ link.title }} <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
        <aside class="identity-card" aria-label="主页概览">
          <div class="identity-person">
            <img :src="avatarSrc" alt="" width="80" height="80" />
            <div>
              <strong>{{ personalProfile.name }}</strong>
              <span class="mono">@tfgkk</span>
            </div>
          </div>
          <dl>
            <div>
              <dt class="mono">Projects</dt>
              <dd>{{ projects.length }}</dd>
            </div>
            <div>
              <dt class="mono">Algorithms</dt>
              <dd>{{ algorithmTopics.length }}</dd>
            </div>
            <div>
              <dt class="mono">Tools</dt>
              <dd>2</dd>
            </div>
          </dl>
        </aside>
      </section>
      <ProjectExplorer />
      <section id="tools" ref="toolbox" class="tools-section" aria-labelledby="tools-title">
        <div class="section-heading">
          <h2 id="tools-title" class="mono"><span>02 /</span> Toolbox</h2>
          <span class="tools-caption">纯浏览器处理 · 无需上传</span>
        </div>
        <ToolboxSection v-if="toolsVisible" />
        <div v-else class="tools-placeholder">
          <button @click="toolsVisible = true">打开工具箱 ↗</button>
        </div>
      </section>
      <LinksSection :groups="linkGroups" />
    </main>

    <footer class="site-footer mono">
      <span>© {{ new Date().getFullYear() }} TFGKK</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  </div>
</template>

<style scoped>
.page-shell {
  width: min(1440px, calc(100% - 4rem));
  margin: 0 auto;
}
.site-nav,
.site-nav nav,
.nav-cluster,
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-cluster {
  gap: 1rem;
}
.theme-toggle {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
}
.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent-border);
}
.theme-toggle svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.tools-section {
  padding-top: 3.5rem;
}
.identity {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: clamp(2.5rem, 7vw, 7rem);
  align-items: end;
  padding: clamp(3.5rem, 8vw, 7.5rem) 0 4rem;
  border-bottom: 1px solid var(--line);
}
.identity-copy {
  max-width: 780px;
}
.identity-copy > .mono {
  color: var(--accent);
  font-size: 0.6rem;
}
.identity h1 {
  max-width: none;
  margin-top: 1.1rem;
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.065em;
}
.identity-copy > p {
  max-width: 34rem;
  margin-top: 1.4rem;
  color: var(--muted);
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
}
.focus-list,
.identity-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
.focus-list {
  margin-top: 1.6rem;
  list-style: none;
}
.focus-list li {
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.7rem;
}
.identity-links {
  margin-top: 2rem;
}
.identity-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0 0.9rem;
  border-bottom: 1px solid var(--control-line);
  font-size: 0.76rem;
}
.identity-links a:hover {
  border-color: var(--accent);
}
.identity-card {
  padding-left: 1.5rem;
  border-left: 1px solid var(--line);
}
.identity-person {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.identity-person img {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--avatar-surface);
}
.identity-person div {
  display: grid;
  gap: 0.2rem;
}
.identity-person strong {
  font-size: 1rem;
  font-weight: 600;
}
.identity-person span {
  color: var(--muted);
  font-size: 0.58rem;
}
.identity-card dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 1.5rem;
  border-top: 1px solid var(--line);
}
.identity-card dl div {
  padding-top: 0.9rem;
}
.identity-card dt {
  color: var(--muted);
  font-size: 0.5rem;
}
.identity-card dd {
  margin-top: 0.25rem;
  font-family: var(--font-mono);
  font-size: 1.05rem;
}
.tools-caption {
  font-size: 0.7rem;
  color: var(--muted) !important;
  margin-right: 0 !important;
}
.tools-placeholder {
  min-height: 560px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
}
.tools-placeholder button {
  background: var(--surface);
  padding: 0.8rem 1rem;
  border: 1px solid var(--line);
  border-radius: 4px;
}
.site-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  min-height: 80px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}
.brand img {
  border-radius: 50%;
}
.brand-mark {
  margin-left: 0.3rem;
  color: var(--muted);
  font-family: var(--font-mono);
  font-weight: 400;
}
.site-nav nav {
  gap: 1.8rem;
  font-size: 0.8rem;
  color: var(--muted);
}
.site-nav a,
.site-footer a {
  padding-block: 0.75rem;
}
.site-footer {
  margin-top: 3.5rem;
  padding: 1.4rem 0 2rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
}
.skip-link {
  position: fixed;
  top: -5rem;
  z-index: 10;
  padding: 0.7rem 1rem;
  background: var(--surface);
}
.skip-link:focus {
  top: 1rem;
}
@media (max-width: 600px) {
  .page-shell {
    width: calc(100% - 2.5rem);
  }
  .site-nav {
    min-height: 72px;
  }
  .site-nav nav {
    gap: 0.7rem;
    font-size: 0.72rem;
  }
  .nav-cluster {
    gap: 0.45rem;
  }
  .theme-toggle {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }
  .brand-mark {
    display: none;
  }
  .identity {
    grid-template-columns: 1fr;
    gap: 2.25rem;
    padding: 3rem 0;
  }
  .identity h1 {
    max-width: 8ch;
    font-size: clamp(2.35rem, 13vw, 3.4rem);
  }
  .identity-card {
    padding: 1.25rem 0 0;
    border-top: 1px solid var(--line);
    border-left: 0;
  }
}
@media (max-width: 360px) {
  .brand img {
    display: none;
  }
  .tools-caption {
    display: none;
  }
}
</style>
