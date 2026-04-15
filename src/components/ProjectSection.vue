<script lang="ts" setup>
interface Project {
  title: string
  subtitle: string
  desc: string
  tech: string[]
  features: string[]
  github: string
}

interface Props {
  project: Project
  index: number
  isVisible: boolean
}

defineProps<Props>()
</script>

<template>
  <section class="page-section project-view">
    <div class="project-board" :class="{ 'board-visible': isVisible }">
      <div class="board-header">
        <div class="board-index">0{{ index + 1 }}</div>
        <div class="board-title-group">
          <h2 class="board-title">{{ project.title }}</h2>
          <span class="board-subtitle">{{ project.subtitle }}</span>
        </div>
      </div>
      <div class="board-body">
        <div class="board-left">
          <p class="board-desc">{{ project.desc }}</p>
          <div class="tech-stack">
            <div v-for="t in project.tech" :key="t" class="tech-chip">
              <span class="chip-dot"></span>{{ t }}
            </div>
          </div>
        </div>
        <div class="board-right">
          <div class="features-label">Key Features</div>
          <ul class="features-list">
            <li v-for="f in project.features" :key="f">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
      <div class="board-footer">
        <a :href="project.github" target="_blank" class="github-action">
          <span>Source Code</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-view { 
  height: 100vh; 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
  padding: 0 40px; 
}

.project-board { 
  width: 100%; 
  max-width: 1000px; 
  background: var(--glass-bg); 
  border-radius: clamp(24px, 5vw, 36px); 
  border: 1px solid var(--glass-border); 
  backdrop-filter: blur(25px); 
  padding: clamp(25px, 5vw, 55px); 
  display: flex; 
  flex-direction: column; 
  gap: clamp(20px, 4vw, 40px); 
  box-shadow: 0 40px 80px rgba(0,0,0,0.12); 
  opacity: 0; 
  transform: scale(0.92) translateY(40px); 
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
}

.board-visible { opacity: 1; transform: scale(1) translateY(0); }

.board-header { display: flex; align-items: center; gap: 20px; }
.board-index { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; color: var(--accent); opacity: 0.2; font-family: monospace; line-height: 1; }
.board-title { font-size: clamp(1.5rem, 4vw, 2.6rem); font-weight: 800; margin: 0; color: var(--text-main); }
.board-subtitle { font-size: 0.9rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

.board-body { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(20px, 5vw, 50px); }
.board-desc { font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.6; color: var(--text-main); margin-bottom: 20px; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 10px; }
.tech-chip { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(37, 99, 235, 0.08); border: 1px solid var(--accent); border-radius: 100px; font-size: 0.85rem; font-weight: 700; color: var(--accent); }
.chip-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

.features-label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-mute); letter-spacing: 2px; margin-bottom: 15px; font-weight: 700; }
.features-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.features-list li { display: flex; align-items: center; gap: 12px; color: var(--text-main); font-size: 0.95rem; }
.features-list li svg { width: 18px; height: 18px; color: var(--accent); flex-shrink: 0; }

.github-action { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: var(--text-main); color: var(--bg); text-decoration: none; border-radius: 14px; font-weight: 700; transition: 0.3s; width: fit-content; }
.github-action:hover { opacity: 0.9; transform: translateY(-2px); }

@media (max-width: 900px) { 
  .board-body { grid-template-columns: 1fr; gap: 20px; } 
  .project-view { padding: 0 20px; }
  .project-board { padding: 30px; }
}
</style>
