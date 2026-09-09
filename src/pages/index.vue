<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectSection from '../components/ProjectSection.vue'
import LinksSection from '../components/LinksSection.vue'
import { projects, linkGroups } from '../data/portfolio'

const page = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
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

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div id="top" ref="page" class="page-shell">
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-nav">
      <a class="brand" href="#top" aria-label="TFGKK home">
        <span class="brand-mark" aria-hidden="true">[t]</span> tfgkk
      </a>
      <nav aria-label="Page sections">
        <a href="#work">Work</a>
        <a href="#resources">Links</a>
        <a href="mailto:1316187067@qq.com">Contact <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main id="content" tabindex="-1">
      <HeroSection :project-count="projects.length" />
      <section id="work" class="section" aria-labelledby="work-title">
        <div class="section-heading">
          <h2 id="work-title" class="mono"><span>01 /</span> Selected work</h2>
          <small class="mono">{{ String(projects.length).padStart(2, '0') }} projects</small>
        </div>
        <ProjectSection
          v-for="(project, index) in projects"
          :key="project.url"
          :project="project"
          :index="index"
        />
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
  width: min(1040px, calc(100% - 4rem));
  margin: 0 auto;
}
.site-nav,
.site-nav nav,
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.site-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  min-height: 88px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}
.brand {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}
.brand-mark {
  margin-right: 0.7rem;
  color: var(--accent);
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
.section {
  padding-top: 5rem;
}
.site-footer {
  margin-top: 6rem;
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
    gap: 1rem;
  }
  .brand-mark {
    margin-right: 0.3rem;
  }
  .section {
    padding-top: 3.5rem;
  }
}
</style>
