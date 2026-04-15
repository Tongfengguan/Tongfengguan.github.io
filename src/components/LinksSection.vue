<script lang="ts" setup>
import ProjectLinks from './ProjectLinks.vue'

interface ProjectItem {
  title: string
  desc: string
  url: string
  icon: string
}

interface SocialItem {
  name: string
  url: string
}

interface Props {
  projects: ProjectItem[]
  socials: SocialItem[]
  isVisible: boolean
}

defineProps<Props>()
</script>

<template>
  <section class="page-section links-view">
    <div class="links-content-wrapper" :class="{ 'visible': isVisible }">
      <ProjectLinks :projects="projects" />
      <footer class="footer">
        <div class="socials">
          <a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" class="social-tag">
            {{ s.name }}
          </a>
        </div>
        <p class="copy">© 2024 TFGKK · Digital Portfolio</p>
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
  transition: 0.8s 0.3s; 
}

.links-content-wrapper.visible { opacity: 1; }

.footer { margin-top: 60px; text-align: center; }
.socials { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; }

.social-tag { 
  padding: 8px 18px; 
  background: var(--glass-bg); 
  border-radius: 10px; 
  text-decoration: none; 
  color: var(--text-main); 
  border: 1px solid var(--glass-border); 
  transition: 0.3s; 
  font-size: 0.9rem;
}

.social-tag:hover { 
  border-color: var(--accent); 
  transform: translateY(-3px); 
  background: var(--glass-bg);
}

.copy { color: var(--text-mute); font-size: 0.85rem; }

@media (max-width: 600px) {
  .links-view { padding: 0 20px; }
  .footer { margin-top: 40px; }
}
</style>
