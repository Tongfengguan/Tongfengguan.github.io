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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
      <div class="board-footer">
        <a :href="project.github" target="_blank" class="github-action" aria-label="View source code on GitHub">
          <span>Source Code</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
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
  padding: 20px; 
}

.project-board { 
  width: 100%; 
  max-width: 1100px; 
  background: var(--card-bg); 
  border: 4px solid var(--border); 
  padding: clamp(20px, 5vw, 60px); 
  display: flex; 
  flex-direction: column; 
  gap: clamp(20px, 4vw, 40px); 
  box-shadow: clamp(8px, 2vw, 16px) clamp(8px, 2vw, 16px) 0px var(--shadow); 
  opacity: 0; 
  transform: translate(-10px, 10px); 
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
  max-height: 90vh; /* 避免在小屏幕溢出 */
  overflow-y: auto; /* 极端情况允许内部滚动 */
}

.board-visible { opacity: 1; transform: translate(0, 0); }

.board-header { 
  display: flex; 
  align-items: flex-end; 
  gap: 15px; 
  border-bottom: 4px solid var(--border); 
  padding-bottom: 15px; 
}
.board-index { font-size: clamp(3rem, 8vw, 5rem); font-weight: 950; color: var(--accent); line-height: 0.8; }
.board-title { font-size: clamp(1.2rem, 5vw, 3rem); font-weight: 900; text-transform: uppercase; margin: 0; color: var(--text-main); }
.board-subtitle { font-size: clamp(0.8rem, 2vw, 1.1rem); background: var(--accent); color: #000; padding: 2px 8px; font-weight: 800; white-space: nowrap; }

.board-body { 
  display: grid; 
  grid-template-columns: 1.2fr 1fr; 
  gap: clamp(20px, 5vw, 60px); 
}
.board-desc { font-size: clamp(1rem, 2.5vw, 1.3rem); line-height: 1.3; color: var(--text-main); font-weight: 500; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 10px; }
.tech-chip { 
  display: flex; align-items: center; gap: 6px; padding: 6px 12px; 
  background: var(--bg); border: 2px solid var(--border); 
  font-size: 0.9rem; font-weight: 800; color: var(--text-main);
  box-shadow: 3px 3px 0px var(--border);
}
.chip-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 0; }

.features-label { font-size: 0.9rem; text-transform: uppercase; background: var(--text-main); color: var(--bg); display: inline-block; padding: 2px 10px; margin-bottom: 15px; font-weight: 900; }
.features-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.features-list li { display: flex; align-items: center; gap: 12px; color: var(--text-main); font-size: clamp(0.9rem, 2vw, 1.1rem); font-weight: 600; }
.features-list li svg { width: 18px; height: 18px; color: var(--accent); flex-shrink: 0; }

.github-action { 
  display: inline-flex; align-items: center; gap: 10px; padding: 12px 25px; 
  background: var(--accent); color: #000 !important; text-decoration: none; 
  border: 3px solid var(--border); font-weight: 900; font-size: 1.1rem;
  box-shadow: 4px 4px 0px var(--border);
  transition: 0.2s;
  width: fit-content;
}

@media (max-width: 900px) { 
  .board-body { grid-template-columns: 1fr; gap: 25px; } 
  .project-view { padding: 15px; }
  .project-board { padding: 25px; gap: 25px; }
  .board-header { flex-direction: row; align-items: center; }
  .board-index { display: none; } /* 移动端隐藏巨大数字以节省空间 */
}
</style>
