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
  <div class="bookmarks-container">
    <div class="header-tag">一些奇奇怪怪的东西喵</div>
    
    <div class="category-grid">
      <div v-for="cat in bookmarks" :key="cat.category" class="category-block">
        <div class="category-header">
          <h3 class="category-title">{{ cat.category }}</h3>
        </div>

        <div class="links-list">
          <div v-for="link in cat.links" :key="link.title" class="bookmark-wrapper">
            <a :href="link.url" target="_blank" class="bookmark-card">
              <div class="card-top">
                <span class="card-title">{{ link.title }}</span>
                <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"></path>
                </svg>
              </div>
              <p class="card-desc">{{ link.desc }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-container { width: 100%; display: flex; flex-direction: column; gap: 30px; }
.header-tag { 
  display: inline-block; background: var(--text-main); color: var(--bg); 
  padding: 8px 25px; font-weight: 950; font-size: 1.5rem; text-transform: uppercase; 
  border: 3px solid var(--border); box-shadow: 6px 6px 0px var(--accent); 
  width: fit-content; transform: rotate(-0.5deg); 
}

.category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
.category-block { 
  background: var(--card-bg); border: 4px solid var(--border); 
  padding: 25px; box-shadow: 10px 10px 0px var(--shadow); position: relative; 
}
.category-header { 
  display: flex; justify-content: space-between; align-items: flex-start; 
  margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid var(--border); 
}
.category-title { font-size: 1.4rem; font-weight: 900; color: var(--text-main); margin: 0; }

.links-list { display: flex; flex-direction: column; gap: 15px; }
.bookmark-wrapper { position: relative; }
.bookmark-card { 
  display: block; padding: 15px; background: var(--bg); 
  border: 2px solid var(--border); text-decoration: none; 
  transition: 0.2s; box-shadow: 4px 4px 0px var(--border); 
}
.bookmark-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px var(--accent); }

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.card-title { font-weight: 800; color: var(--text-main); font-size: 1.1rem; }
.external-icon { width: 16px; height: 16px; color: var(--accent); }
.card-desc { font-size: 0.85rem; color: var(--text-mute); margin: 0; line-height: 1.4; font-weight: 500; }

@media (max-width: 600px) { 
  .category-grid { grid-template-columns: 1fr; } 
  .header-tag { font-size: 1.2rem; } 
}
</style>
