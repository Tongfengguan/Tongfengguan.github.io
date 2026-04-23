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

// 交互状态
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const activeSticker = ref<number | null>(null)

// 准星追踪逻辑
const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value || !props.isVisible) return
  isHovering.value = true
  const rect = containerRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const resetInteraction = () => {
  isHovering.value = false
}

const toggleSticker = (i: number) => {
  if (window.innerWidth < 1100) {
    activeSticker.value = activeSticker.value === i ? null : i
  }
}
</script>

<template>
  <section 
    class="page-section project-view" 
    ref="containerRef" 
    @mousemove="handleMouseMove"
    @mouseleave="resetInteraction"
  >
    <!-- V7 终极看板：机密解构 HUD -->
    <div 
      class="hud-v7-board" 
      :class="{ 'hud-active': isVisible }"
    >
      
      <!-- 1. 动态 SVG 组装边框 -->
      <svg class="hud-border-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path class="border-path" d="M100,0 L20,0 L0,100 L0,580 L20,600 L300,600 M700,600 L980,600 L1000,500 L1000,20 L980,0 L800,0" fill="none" stroke="var(--accent)" stroke-width="2" />
        <circle cx="20" cy="20" r="3" fill="var(--accent)" class="deco-dot" />
        <circle cx="980" cy="580" r="3" fill="var(--accent)" class="deco-dot" />
      </svg>

      <!-- 2. 交互准星层 (仅在 PC 端显示) -->
      <div 
        v-if="isHovering" 
        class="hud-crosshair"
        :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
      >
        <div class="ch-line h"></div>
        <div class="ch-line v"></div>
        <div class="ch-label">TRACKING...</div>
      </div>

      <!-- 3. 内容层 -->
      <div class="hud-content-grid">
        
        <!-- 左侧：战术规格 -->
        <div class="spec-side">
          <div class="hud-header">
            <div class="danger-tag">TOP_SECRET</div>
            <div class="subject-id">ID: 0{{ index + 1 }} // EVA_PROJECT</div>
            <h2 class="project-title">{{ project.title }}</h2>
          </div>

          <div class="desc-box">
            <div class="desc-line"></div>
            <p>{{ project.desc }}</p>
          </div>

          <div class="tech-stack-hud">
            <div v-for="t in project.tech" :key="t" class="tech-item">
              <span class="tech-icon"></span> {{ t }}
            </div>
          </div>

          <a :href="project.github" target="_blank" class="nerv-action">
            <div class="action-bg"></div>
            <span class="action-text">ACCESS SOURCE CODE</span>
          </a>
        </div>

        <!-- 右侧：解构贴纸云 -->
        <div class="feature-side">
          <div class="feature-grid">
            <div 
              v-for="(feature, i) in project.features" 
              :key="i"
              class="sticker-v7"
              :class="{ 'mobile-active': activeSticker === i }"
              @click="toggleSticker(i)"
              :style="{ '--delay': (0.5 + i * 0.1) + 's' }"
            >
              <div class="sticker-inner">
                <span class="sticker-num">0{{ i + 1 }}</span>
                {{ feature }}
              </div>
              <div class="sticker-border"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- 装饰用底部读数 -->
      <div class="hud-footer-info">
        <span>EST_TIME: 2024-04-23</span>
        <span class="blink">TERMINAL_ACTIVE</span>
        <span>LOCATION: NERV_HQ_CENTRAL_DOGMA</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Share+Tech+Mono&display=swap');

.project-view {
  height: 100vh; width: 100%;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; padding: 40px; box-sizing: border-box;
  background: transparent;
  font-family: 'Share Tech Mono', monospace;
}

.hud-v7-board {
  position: relative;
  width: 100%; max-width: 1300px;
  height: 80vh; max-height: 700px;
  background: rgba(var(--bg), 0.7);
  backdrop-filter: blur(10px);
  opacity: 0; transform: translateY(40px) scale(0.98);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  padding: 50px; box-sizing: border-box;
}
.hud-active { opacity: 1; transform: translateY(0) scale(1); }

/* SVG 边框动画 */
.hud-border-svg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}
.border-path {
  stroke-dasharray: 2000; stroke-dashoffset: 2000;
  transition: stroke-dashoffset 2s 0.3s ease;
}
.hud-active .border-path { stroke-dashoffset: 0; }

.deco-dot { opacity: 0; transition: 0.5s 1.5s; }
.hud-active .deco-dot { opacity: 1; }

/* 交互准星 */
.hud-crosshair {
  position: absolute; width: 60px; height: 60px;
  pointer-events: none; z-index: 100;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease-out;
}
.ch-line { position: absolute; background: var(--accent); opacity: 0.6; }
.ch-line.h { top: 50%; left: 0; width: 100%; height: 1px; }
.ch-line.v { left: 50%; top: 0; height: 100%; width: 1px; }
.ch-label { position: absolute; top: -15px; left: 10px; font-size: 0.5rem; color: var(--accent); font-weight: 900; }

/* 内容布局 */
.hud-content-grid {
  display: grid; grid-template-columns: 1.2fr 1fr;
  gap: 60px; height: 100%; align-items: center;
}

.danger-tag { background: var(--eva-red); color: #fff; padding: 2px 8px; font-size: 0.7rem; font-weight: 900; display: inline-block; margin-bottom: 10px; }
.subject-id { font-size: 0.8rem; color: var(--accent); opacity: 0.7; margin-bottom: 5px; }
.project-title { font-family: 'Orbitron', sans-serif; font-size: 3.5rem; font-weight: 900; margin: 0; color: var(--text-main); line-height: 1; text-transform: uppercase; }

.desc-box { margin: 25px 0; position: relative; }
.desc-line { width: 40px; height: 3px; background: var(--accent); margin-bottom: 15px; }
.desc-box p { font-size: 1.1rem; line-height: 1.5; color: var(--text-main); font-weight: 600; margin: 0; }

.tech-stack-hud { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
.tech-item { font-size: 0.8rem; font-weight: 900; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
.tech-icon { width: 6px; height: 6px; background: var(--accent); transform: rotate(45deg); }

.nerv-action {
  position: relative; display: inline-block; padding: 15px 35px;
  text-decoration: none; overflow: hidden;
  border: 2px solid var(--accent);
}
.action-bg { position: absolute; inset: 0; background: var(--accent); transform: translateX(-100%); transition: 0.3s; }
.nerv-action:hover .action-bg { transform: translateX(0); }
.action-text { position: relative; z-index: 1; font-weight: 900; color: var(--accent); transition: 0.3s; }
.nerv-action:hover .action-text { color: #000; }

/* 解构贴纸云 */
.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.sticker-v7 {
  position: relative; padding: 15px; background: rgba(var(--accent), 0.05);
  border: 1px solid rgba(var(--accent), 0.3);
  opacity: 0; transform: translateX(20px);
  transition: all 0.4s ease; cursor: pointer;
}
.hud-active .sticker-v7 { opacity: 1; transform: translateX(0); transition-delay: var(--delay); }

.sticker-num { font-size: 0.6rem; color: var(--accent); display: block; margin-bottom: 5px; opacity: 0.6; }
.sticker-inner { color: var(--text-main); font-weight: 900; font-size: 1rem; }
.sticker-border { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-right: 2px solid var(--accent); border-bottom: 2px solid var(--accent); }

.sticker-v7:hover { background: var(--accent); }
.sticker-v7:hover .sticker-inner, .sticker-v7:hover .sticker-num { color: #000; }
.sticker-v7:hover .sticker-border { border-color: #000; }

.hud-footer-info {
  position: absolute; bottom: 20px; left: 50px; right: 50px;
  display: flex; justify-content: space-between;
  font-size: 0.6rem; color: var(--accent); opacity: 0.5; font-weight: 900;
}
.blink { animation: blink-hud 1s step-end infinite; }
@keyframes blink-hud { 50% { opacity: 0; } }

@media (max-width: 1100px) {
  .hud-v7-board { height: auto; max-height: none; padding: 30px; }
  .hud-content-grid { grid-template-columns: 1fr; gap: 30px; }
  .project-title { font-size: 2.2rem; }
  .feature-grid { grid-template-columns: 1fr; }
  .hud-crosshair, .hud-border-svg { display: none; }
  .hud-v7-board { border: 2px solid var(--accent); }
}
</style>
