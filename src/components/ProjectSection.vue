<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

interface Project {
  title: string
  subtitle: string
  desc: string
  tech: string[]
  features: string[]
  github: string
  image?: string
}

interface Props {
  project: Project
  index: number
  isVisible: boolean
}

const props = defineProps<Props>()

// 3D 视差微位移
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value || !props.isVisible) return
  isHovering.value = true
  const rect = containerRef.value.getBoundingClientRect()
  mouseX.value = (e.clientX - rect.left) / rect.width - 0.5
  mouseY.value = (e.clientY - rect.top) / rect.height - 0.5
}

const resetInteraction = () => { isHovering.value = false; mouseX.value = 0; mouseY.value = 0 }
</script>

<template>
  <section 
    class="page-section project-view" 
    ref="containerRef" 
    @mousemove="handleMouseMove"
    @mouseleave="resetInteraction"
  >
    <!-- 全息控制台面板 (V8: Holographic Console) -->
    <div 
      class="holographic-panel" 
      :class="{ 'panel-active': isVisible }"
      :style="{ 
        transform: `perspective(1500px) rotateX(${mouseY * -5}deg) rotateY(${mouseX * 5}deg)`,
        '--p-x': mouseX * 20 + 'px',
        '--p-y': mouseY * 20 + 'px'
      }"
    >
      <!-- 0. 底层受控颗粒感预览图 -->
      <div v-if="project.image" class="project-visual-bg" :style="{ backgroundImage: `url(${project.image})` }"></div>
      <div class="visual-overlay"></div>

      <!-- 1. 装饰性 HUD 线条与角标 -->
      <div class="hud-frame">
        <div class="hud-corner top-l"></div><div class="hud-corner top-r"></div>
        <div class="hud-corner bot-l"></div><div class="hud-corner bot-r"></div>
        <div class="hud-scanline"></div>
      </div>

      <div class="panel-main-grid">
        <!-- 2. 左侧：核心情报区 -->
        <div class="intel-side">
          <div class="intel-header">
            <div class="status-indicator">
              <span class="dot blink"></span>
              <span class="mode">SYNC_DATA_LINK</span>
            </div>
            <div class="subject-id">SUBJECT_{{ index + 1 }}</div>
            <h2 class="project-title">{{ project.title }}</h2>
            <div class="project-subtitle">{{ project.subtitle }}</div>
          </div>

          <div class="intel-body">
            <p class="project-desc">{{ project.desc }}</p>
            
            <!-- 技术节点网络 -->
            <div class="tech-nodes">
              <div class="nodes-label">CORE_MODULES</div>
              <div class="nodes-list">
                <div v-for="t in project.tech" :key="t" class="tech-node">
                  <div class="node-dot"></div>
                  <span class="node-text">{{ t }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="intel-footer">
            <a :href="project.github" target="_blank" class="access-btn">
              <span class="btn-scan"></span>
              <span class="btn-text">ACCESS_DATA_CORE</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          </div>
        </div>

        <!-- 3. 右侧：指令流监视器 -->
        <div class="monitor-side">
          <div class="monitor-header">
            <span class="mon-title">SYSTEM_SPECIFICATIONS</span>
            <span class="mon-ver">v2.0.4</span>
          </div>
          
          <div class="command-stream">
            <div 
              v-for="(feature, i) in project.features" 
              :key="i"
              class="command-line"
              :style="{ '--delay': (0.6 + i * 0.1) + 's' }"
            >
              <span class="cmd-prefix">> [MODULE_0{{ i + 1 }}]</span>
              <span class="cmd-val">{{ feature }}</span>
              <span class="cmd-status">OK</span>
            </div>
            <!-- 填充空行增加氛围 -->
            <div class="command-line ghost" v-for="j in 2" :key="'g'+j">
              <span class="cmd-prefix">> [BUFFER_LOG]</span>
              <span class="cmd-val">RELOADING_CACHE_{{ j }}...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 底部全息读数 -->
      <div class="panel-metadata">
        <div class="meta-item">ENCRYPTION: AES-256</div>
        <div class="meta-item">BITRATE: 1024 KBPS</div>
        <div class="meta-item">ORIGIN: NERV_CENTRAL_DATABASE</div>
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
}

.holographic-panel {
  position: relative;
  width: 100%; max-width: 1350px;
  height: 85vh; max-height: 750px;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
  padding: 50px; box-sizing: border-box;
  opacity: 0; transform: translateY(40px) scale(0.98);
  transition: transform 0.3s ease-out, opacity 1s, border-color 0.8s;
  transform-style: preserve-3d;
}
.panel-active { opacity: 1; transform: translateY(0) scale(1); }

/* --- 0. 背景预览图处理 --- */
.project-visual-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: grayscale(1) brightness(0.3);
  mix-blend-mode: luminosity;
  opacity: 0.15; z-index: 0;
  transition: opacity 0.5s;
}
.holographic-panel:hover .project-visual-bg { opacity: 0.25; }
.visual-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent, rgba(0,0,0,0.6)); z-index: 1; }

/* --- 1. HUD 框架 --- */
.hud-frame { position: absolute; inset: 0; pointer-events: none; z-index: 10; }
.hud-corner { position: absolute; width: 30px; height: 30px; border: 3px solid var(--accent); }
.top-l { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
.top-r { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
.bot-l { bottom: -2px; left: -2px; border-right: 0; border-top: 0; }
.bot-r { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }
.hud-scanline { 
  position: absolute; left: 0; width: 100%; height: 1px; 
  background: rgba(var(--accent-rgb), 0.2); 
  box-shadow: 0 0 10px var(--accent);
  animation: h-scan 6s linear infinite;
}
@keyframes h-scan { from { top: 0; } to { top: 100%; } }

/* --- 布局网格 --- */
.panel-main-grid {
  position: relative; z-index: 5;
  display: grid; grid-template-columns: 1.3fr 1fr;
  gap: 60px; height: 100%;
}

/* --- 2. 左侧核心情报 --- */
.intel-side { display: flex; flex-direction: column; height: 100%; transform: translateZ(30px); }

.status-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.status-indicator .dot { width: 6px; height: 6px; background: var(--eva-green); border-radius: 50%; box-shadow: 0 0 8px var(--eva-green); }
.status-indicator .mode { font-size: 0.6rem; font-weight: 900; color: var(--eva-green); letter-spacing: 2px; }

.subject-id { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: var(--accent); opacity: 0.8; margin-bottom: 5px; }
.project-title { font-family: 'Orbitron', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; margin: 0; color: var(--text-main); line-height: 0.9; text-transform: uppercase; }
.project-subtitle { font-size: 1rem; color: var(--accent); font-weight: 800; margin-top: 10px; letter-spacing: 2px; }

.project-desc { font-size: 1.15rem; line-height: 1.5; color: var(--text-main); margin: 30px 0; opacity: 0.9; font-weight: 600; }

.tech-nodes { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(var(--accent-rgb), 0.2); }
.nodes-label { font-size: 0.65rem; color: var(--accent); opacity: 0.5; margin-bottom: 15px; font-weight: 900; }
.nodes-list { display: flex; flex-wrap: wrap; gap: 15px; }
.tech-node { display: flex; align-items: center; gap: 10px; padding: 6px 14px; background: rgba(var(--accent-rgb), 0.05); border: 1px solid rgba(var(--accent-rgb), 0.3); position: relative; }
.node-dot { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 6px var(--accent); }
.node-text { font-size: 0.8rem; font-weight: 900; color: var(--text-main); }

.intel-footer { margin-top: 40px; }
.access-btn { 
  position: relative; display: flex; align-items: center; gap: 15px;
  padding: 18px 40px; background: var(--accent); color: var(--accent-text) !important;
  text-decoration: none; font-weight: 950; font-size: 1rem;
  letter-spacing: 2px; border: none; overflow: hidden;
}
.btn-scan { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: b-scan 3s infinite; }
@keyframes b-scan { to { left: 100%; } }
.access-btn svg { width: 20px; height: 20px; color: inherit; }

/* --- 3. 右侧指令流监视器 --- */
.monitor-side { 
  display: flex; flex-direction: column; 
  background: rgba(10, 10, 10, 0.8); /* 统一深色背板，确保白字绝对清晰 */
  border: 1px solid rgba(var(--accent-rgb), 0.4); 
  padding: 25px;
  transform: translateZ(50px);
  backdrop-filter: blur(15px);
}

.monitor-header { display: flex; justify-content: space-between; border-bottom: 2px solid var(--accent); padding-bottom: 10px; margin-bottom: 20px; }
.mon-title { font-size: 0.75rem; font-weight: 900; color: var(--accent); letter-spacing: 1px; }
.mon-ver { font-size: 0.6rem; opacity: 0.4; color: #fff; }

.command-stream { display: flex; flex-direction: column; gap: 15px; overflow: hidden; }
.command-line { 
  display: flex; align-items: center; gap: 15px; font-size: 0.9rem;
  opacity: 0; transform: translateX(20px);
}
.panel-active .command-line { animation: c-entry 0.5s forwards; animation-delay: var(--delay); }
@keyframes c-entry { to { opacity: 1; transform: translateX(0); } }

.cmd-prefix { 
  color: var(--accent); font-weight: 900; font-size: 0.75rem; 
  text-shadow: 0 0 5px rgba(var(--accent-rgb), 0.3); 
  flex-shrink: 0;
}
.cmd-val { 
  color: #fff !important; /* 统一强制白色 */
  font-weight: 900; 
  flex: 1; 
  letter-spacing: 1px;
  font-size: 1rem;
  /* 增加外发光，模拟电子屏幕感 */
  text-shadow: 0 0 8px rgba(var(--accent-rgb), 0.5);
}

.cmd-status { color: var(--eva-green); font-weight: 900; font-size: 0.75rem; padding: 1px 6px; border: 1px solid var(--eva-green); box-shadow: 0 0 5px var(--eva-green); }

.command-line.ghost { opacity: 0.2 !important; filter: grayscale(1); }

/* --- 4. 底部读数 --- */
.panel-metadata {
  position: absolute; bottom: 15px; left: 50px; right: 50px;
  display: flex; justify-content: space-between;
  font-size: 0.6rem; font-weight: 900; color: var(--accent); opacity: 0.4; letter-spacing: 2px;
}

.blink { animation: b-blink 1s step-end infinite; }
@keyframes b-blink { 50% { opacity: 0; } }

@media (max-width: 1100px) {
  .holographic-panel { height: auto; max-height: none; padding: 30px; transform: none !important; }
  .panel-main-grid { grid-template-columns: 1fr; gap: 40px; }
  .project-title { font-size: 2.2rem; }
  .monitor-side { padding: 15px; }
  .command-line { font-size: 0.8rem; }
  .project-visual-bg { display: none; }
  .panel-metadata { display: none; }
}
</style>
