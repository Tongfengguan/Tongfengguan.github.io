<script lang="ts" setup>
interface LinkItem {
  title: string
  desc: string
  url: string
}

interface BookmarkCategory {
  category: string
  links: LinkItem[]
}

interface Props {
  bookmarks: BookmarkCategory[]
}

defineProps<Props>()
</script>

<template>
  <section class="links-section">
    <div class="links-header">
      <span class="mono">RESOURCES & LINKS</span>
    </div>
    
    <div class="links-grid">
      <div v-for="cat in bookmarks" :key="cat.category" class="category">
        <h3 class="mono cat-title">{{ cat.category }}</h3>
        <ul class="link-list">
          <li v-for="link in cat.links" :key="link.title">
            <a :href="link.url" target="_blank" class="link-anchor">
              <span class="link-title"><span class="mono" style="color:var(--accent2); margin-right: 0.5rem;">[link]</span>{{ link.title }}</span>
              <span class="mono link-meta">{{ link.desc }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.links-section {
  padding: 8rem 0;
}

.links-header {
  margin-bottom: 4rem;
  opacity: 0.5;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

.cat-title {
  color: var(--muted);
  margin-bottom: 2rem;
}

.link-list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.link-anchor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #27272a;
}

.link-anchor:hover {
  border-color: var(--fg);
}

.link-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.link-meta {
  color: var(--muted);
}

@media (max-width: 768px) {
  .links-grid { grid-template-columns: 1fr; }
  .link-title { font-size: 1.2rem; }
}
</style>
