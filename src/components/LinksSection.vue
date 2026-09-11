<script setup lang="ts">
import type { LinkGroup } from '../data/portfolio'

defineProps<{ groups: LinkGroup[] }>()
</script>

<template>
  <section id="resources" class="links-section" aria-labelledby="links-title">
    <div class="section-heading">
      <h2 id="links-title" class="mono"><span>03 /</span> Elsewhere</h2>
    </div>
    <div class="links-grid">
      <div v-for="group in groups" :key="group.title" class="link-group" data-reveal>
        <h3 class="mono">{{ group.title }}</h3>
        <ul>
          <li v-for="link in group.links" :key="link.url">
            <a
              :href="link.url"
              :target="link.url.startsWith('https:') ? '_blank' : undefined"
              rel="noopener noreferrer"
            >
              <span
                >{{ link.title }}<small>{{ link.detail }}</small></span
              >
              <span class="arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.links-section {
  padding-top: 5rem;
}
.links-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 3.5rem;
}
.link-group h3 {
  color: var(--muted);
  margin: 0.5rem 0 1rem;
  font-size: 0.6rem;
}
ul {
  list-style: none;
}
.link-group a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  min-height: 64px;
  padding-block: 0.65rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.85rem;
}
.link-group small {
  display: block;
  font-size: 0.7rem;
  color: var(--muted);
}
.arrow {
  color: var(--muted);
}
@media (max-width: 600px) {
  .links-section {
    padding-top: 3.5rem;
  }
  .links-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
