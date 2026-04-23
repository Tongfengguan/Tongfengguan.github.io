<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

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

const props = defineProps<Props>()

const cloudX = ref(0)
const cloudY = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  cloudX.value = x * 10
  cloudY.value = y * 10
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <section class="page-section project-view" ref="containerRef">
    <div class="project-layout" :class="{ 'visible': isVisible }">
      
      <!-- 左侧：项目核心信息 -->
      <div class="info-side">
        <div class="project-header">
          <span class="index-tag">NO.{{ index + 1 }}</span>
          <h2 class="title">{{ project.title }}</h2>
          <span class="subtitle">{{ project.subtitle }}</span>
        </div>
        <p class="description">{{ project.desc }}</p>
        <div class="tech-wrap">
          <span v-for="t in project.tech" :key="t" class="tech-tag">{{ t }}</span>
        </div>
        <a :href="project.github" target="_blank" class="brutal-action">
          VIEW SOURCE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>

      <!-- 右侧：词云 (不重叠、无顿挫交互) -->
      <div class="cloud-side">
        <div 
          class="cloud-container"
          :style="{ transform: `translate3d(${cloudX}px, ${cloudY}px, 0)` }"
        >
          <div 
            v-for="(feature, i) in project.features" 
            :key="i"
            class="feature-sticker"
            :style="{
              '--delay': `${i * 0.1}s`,
              '--r-rot': `${(i % 2 === 0 ? -5 : 6) + (i % 3)}deg`,
              '--r-x': `${(i * 37) % 20 - 10}px`,
              '--r-y': `${(i * 53) % 20 - 10}px`
            }"
          >
            {{ feature }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.project-view {
  height: 100vh; width: 100%;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; padding: 40px; box-sizing: border-box;
}

.project-layout {
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: clamp(40px, 8vw, 120px);
  width: 100%; max-width: 1400px;
  max-height: 85vh;
  opacity: 0; transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.project-layout.visible { opacity: 1; transform: translateY(0); }

.info-side { display: flex; flex-direction: column; gap: 20px; justify-content: center; z-index: 10; }

.index-tag { 
  display: inline-block; background: var(--accent); color: #000;
  padding: 4px 12px; font-weight: 950; font-size: 0.9rem;
  border: 2px solid var(--border); box-shadow: 3px 3px 0px var(--border);
  width: fit-content;
}

.title { 
  font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 950; line-height: 1;
  text-transform: uppercase; margin: 0; color: var(--text-main);
  text-shadow: 3px 3px 0px var(--accent);
}

.subtitle { font-size: 0.9rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; }
.description { font-size: 1.05rem; line-height: 1.5; color: var(--text-main); font-weight: 600; }

.tech-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.tech-tag { 
  font-size: 0.75rem; font-weight: 900; padding: 3px 10px;
  background: var(--card-bg); border: 2px solid var(--accent);
  color: var(--text-main); box-shadow: 2px 2px 0px var(--accent);
}

.brutal-action {
  display: flex; align-items: center; gap: 10px;
  background: var(--text-main); color: var(--bg);
  padding: 12px 25px; font-weight: 900; text-decoration: none;
  border: 3px solid var(--border); box-shadow: 5px 5px 0px var(--accent);
  width: fit-content; transition: 0.2s; margin-top: 10px; font-size: 0.9rem;
}
.brutal-action:hover { transform: translate(-3px, -3px); box-shadow: 8px 8px 0px var(--accent); }

.cloud-side {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}

.cloud-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: clamp(20px, 4vw, 45px);
  width: 100%;
  max-width: 900px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.feature-sticker {
  position: relative;
  background: var(--card-bg);
  border: 3px solid var(--border);
  padding: 15px 30px;
  font-size: clamp(0.9rem, 1.2vw, 1.4rem);
  font-weight: 900;
  color: var(--text-main);
  box-shadow: 8px 8px 0px var(--shadow);
  white-space: nowrap;
  cursor: default;
  user-select: none;
  
  transform: translate3d(var(--r-x), var(--r-y), 0) rotate(var(--r-rot));
  
  /* 仅保留简单的、不影响全局的过渡 */
  transition: 
    background 0.3s, 
    color 0.3s, 
    box-shadow 0.3s, 
    transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    
  will-change: transform;
  z-index: 1;
}

/* 入场动画 */
@keyframes sticker-pop {
  from { opacity: 0; transform: scale(0.5) translateY(30px); }
  to { opacity: 1; transform: translate3d(var(--r-x), var(--r-y), 0) rotate(var(--r-rot)); }
}

.feature-sticker {
  animation: sticker-pop 0.6s cubic-bezier(0.23, 1, 0.32, 1) backwards var(--delay);
}

/* 基础悬停反馈：仅自身放大，无顿挫感 */
.feature-sticker:hover {
  transform: translate3d(var(--r-x), var(--r-y), 20px) scale(1.1) rotate(0deg) !important;
  background: var(--accent);
  color: #000;
  box-shadow: 12px 12px 0px var(--border);
  z-index: 100;
}

@media (max-width: 1100px) {
  .project-layout { grid-template-columns: 1fr; gap: 30px; text-align: center; }
  .info-side { align-items: center; }
  .cloud-container { gap: 15px; }
  .feature-sticker { padding: 10px 20px; font-size: 0.9rem; transform: rotate(0deg) !important; }
}
</style>
