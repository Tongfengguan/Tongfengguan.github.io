<script lang="ts" setup>
import ProjectLinks from './ProjectLinks.vue'

interface LinkItem {
  title: string
  desc: string
  url: string
  icon?: string
}

interface BookmarkCategory {
  category: string
  links: LinkItem[]
}

interface SocialItem {
  name: string
  url: string
}

interface Props {
  bookmarks: BookmarkCategory[]
  socials: SocialItem[]
  isVisible: boolean
}

defineProps<Props>()
</script>

<template>
  <section class="page-section links-view">
    <div class="links-content-wrapper" :class="{ 'visible': isVisible }">
      <!-- 重新包装后的 ProjectLinks 接收分类数据 -->
      <ProjectLinks :bookmarks="bookmarks" />
      
      <footer class="footer">
        <div class="socials">
          <a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" class="social-tag">
            {{ s.name }}
          </a>
        </div>
        <div class="copy-box">
          <p class="copy">© 2024 TFGKK · NERV STRATEGIC OPERATIONS</p>
          <div class="status-bar">SYNC STATUS: COMPLETE</div>
        </div>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.links-view { 
  height: 100vh; 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
  padding: 0 40px; 
}

.links-content-wrapper { 
  width: 100%; 
  max-width: 1100px; 
  opacity: 0; 
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
  max-height: 90vh;
  overflow-y: auto;
}

.links-content-wrapper.visible { opacity: 1; transform: translateY(0); }

.footer { 
  margin-top: 60px; 
  border: 4px solid var(--border);
  background: var(--card-bg);
  padding: clamp(20px, 5vw, 40px);
  box-shadow: 12px 12px 0px var(--shadow);
  margin-bottom: 20px;
}

.socials { display: flex; justify-content: flex-start; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }

.social-tag { 
  padding: 12px 25px; 
  background: var(--accent); 
  text-decoration: none; 
  color: var(--accent-text); 
  border: 3px solid var(--border); 
  font-weight: 900;
  box-shadow: 4px 4px 0px var(--border);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  font-size: 0.9rem;
}

.social-tag:hover { 
  transform: translate(-3px, -3px);
  box-shadow: 7px 7px 0px var(--border);
  background: var(--text-main);
  color: var(--bg);
}

.copy-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 3px solid var(--border);
  padding-top: 20px;
}

.copy { color: var(--text-main); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; }
.status-bar { 
  background: var(--text-main); color: var(--bg); 
  padding: 2px 10px; font-weight: 900; font-size: 0.7rem;
}

@media (max-width: 600px) {
  .links-view { padding: 15px; }
  .footer { padding: 20px; margin-top: 40px; }
  .copy-box { flex-direction: column; gap: 15px; align-items: flex-start; }
}
</style>
