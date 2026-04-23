<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  displayedBio: string
  cfRating: string | number
  cfSolved: string | number
  cfRank: string
  cfHistory: number[]
  cfLoading: boolean
  isVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['scroll-down'])

const getRankColor = (rating: any) => {
  const r = Number(rating); if (isNaN(r)) return '#808080'
  if (r < 1200) return '#808080'; if (r < 1400) return '#008000'; if (r < 1600) return '#03a89e'
  if (r < 1900) return '#0000ff'; if (r < 2100) return '#a0a'; if (r < 2400) return '#ff8c00'
  return '#ff0000'
}

// 真实战力折线图映射逻辑
const chartPath = computed(() => {
  if (!props.cfHistory || props.cfHistory.length === 0) return ''
  const max = Math.max(...props.cfHistory) + 100
  const min = Math.min(...props.cfHistory) - 100
  const range = max - min
  return props.cfHistory.map((val, i) => {
    const x = i * (360 / (props.cfHistory.length - 1))
    const y = 100 - ((val - min) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')
})

const chartPoints = computed(() => {
  if (!props.cfHistory || props.cfHistory.length === 0) return []
  const max = Math.max(...props.cfHistory) + 100
  const min = Math.min(...props.cfHistory) - 100
  const range = max - min
  return props.cfHistory.map((val, i) => ({
    x: i * (360 / (props.cfHistory.length - 1)),
    y: 100 - ((val - min) / range) * 80 - 10
  }))
})
</script>

<template>
  <section class="page-section hero-view">
    <div class="bg-watermark">SYNC 400%</div>

    <!-- 核心修复：增加强制居中包装层 -->
    <div class="hud-alignment-wrapper">
      <div class="central-hud" :class="{ 'hud-visible': isVisible }">
        
        <div class="scanner-frame">
          <div class="corner tl"></div><div class="corner tr"></div>
          <div class="corner bl"></div><div class="corner br"></div>
          <div class="scan-line"></div>
        </div>

        <div class="content-core">
          <div class="top-meta">
            <span class="status-dot blink"></span>
            <span class="meta-text">TARGET_LOCKED: UNIT-01_PILOT</span>
          </div>

          <h1 class="pilot-name">TFGKK</h1>
          
          <div class="bio-typing">
            <span class="symbol">></span> {{ displayedBio }}<span class="cursor">_</span>
          </div>

          <div class="central-stats-panel">
            <div class="chart-container">
              <div class="chart-label">TACTICAL_RATING_HISTORY_V2.0</div>
              <svg viewBox="0 0 360 100" class="main-rating-chart">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path v-if="chartPath" :d="`M0,100 L${chartPath} L360,100 Z`" fill="url(#chartGradient)" />
                <polyline v-if="chartPath" fill="none" stroke="var(--accent)" stroke-width="2" :points="chartPath" stroke-linejoin="round" />
                <circle v-for="(p, i) in chartPoints" :key="i" :cx="p.x" :cy="p.y" r="2.5" fill="var(--accent)" />
              </svg>
            </div>
            
            <div class="cf-stats-row">
              <div class="stat-group">
                <span class="label">RATING</span>
                <span class="value" :style="{ color: getRankColor(props.cfRating) }">{{ cfRating }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-group">
                <span class="label">SOLVED</span>
                <span class="value">{{ cfSolved }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-group">
                <span class="label">RANK</span>
                <span class="value" :style="{ color: getRankColor(props.cfRating) }">{{ cfRank }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="mission-trigger" @click="emit('scroll-down')">
      <div class="arrow-down"></div>
      <span>INITIATE SCROLL MISSION</span>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Share+Tech+Mono&display=swap');

.hero-view { 
  height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; 
  font-family: 'Share Tech Mono', monospace; overflow: hidden; position: relative;
}

* { color: var(--text-main); }

/* 强制对齐层 */
.hud-alignment-wrapper {
  width: 100%; display: flex; flex-direction: column; align-items: center;
  margin-top: 18vh; /* 严格避让头像 */
}

.bg-watermark {
  position: absolute; font-family: 'Orbitron', sans-serif;
  font-size: 20vw; font-weight: 900; color: var(--accent);
  opacity: 0.03; user-select: none; pointer-events: none;
  z-index: 1; left: 5%; bottom: 10%;
}

.central-hud {
  position: relative; z-index: 10;
  width: 90%; max-width: 750px;
  padding: 50px 60px;
  opacity: 0; transform: scale(0.95);
  transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
  box-sizing: border-box;
}
.hud-visible { opacity: 1; transform: scale(1); }

/* 锁定框线：绝对居中 */
.scanner-frame { position: absolute; inset: 0; pointer-events: none; }
.corner { position: absolute; width: 60px; height: 60px; border: 4px solid var(--accent); opacity: 0.8; }
.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
.br { bottom: 0; right: 0; border-left: 0; border-top: 0; }

.scan-line {
  position: absolute; left: 0; width: 100%; height: 2px;
  background: var(--accent); opacity: 0.2;
  box-shadow: 0 0 15px var(--accent);
  animation: scan-loop 4s linear infinite;
}
@keyframes scan-loop { 0% { top: 0; } 100% { top: 100%; } }

.content-core { text-align: center; display: flex; flex-direction: column; align-items: center; width: 100%; }

.top-meta { 
  display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  background: var(--eva-red); color: #fff !important; 
  padding: 4px 15px; font-weight: 950; font-size: 0.8rem; letter-spacing: 2px;
}
.top-meta * { color: #fff; }
.status-dot { width: 8px; height: 8px; background: #fff; border-radius: 50%; }
.blink { animation: blink-dot 1s step-end infinite; }
@keyframes blink-dot { 50% { opacity: 0; } }

.pilot-name {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(3rem, 10vw, 6.5rem);
  font-weight: 900; margin: 0;
  line-height: 0.9; letter-spacing: -4px;
  text-shadow: 0 0 30px rgba(var(--accent), 0.2);
}

.bio-typing {
  font-size: 1.2rem; margin-top: 20px; font-weight: 600; opacity: 0.8;
  width: 100%; border-bottom: 2px solid var(--accent); padding-bottom: 12px;
  text-align: center;
}

.central-stats-panel { width: 100%; margin-top: 30px; }
.chart-container { width: 100%; height: 100px; margin-bottom: 20px; position: relative; }
.chart-label { position: absolute; top: -15px; left: 0; font-size: 0.6rem; opacity: 0.4; letter-spacing: 1px; }
.main-rating-chart { width: 100%; height: 100%; overflow: visible; }

.cf-stats-row { 
  display: flex; justify-content: center; align-items: center; gap: clamp(20px, 5vw, 40px);
}
.stat-group { display: flex; flex-direction: column; align-items: center; }
.stat-group .label { font-size: 0.65rem; font-weight: 900; opacity: 0.5; letter-spacing: 2px; }
.stat-group .value { font-size: 1.5rem; font-weight: 900; font-family: 'Orbitron', sans-serif; }
.stat-divider { width: 2px; height: 35px; background: rgba(var(--accent), 0.2); }

.mission-trigger {
  position: absolute; bottom: 40px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center;
  transition: 0.3s;
}
.mission-trigger:hover { transform: translateY(5px); color: var(--eva-orange); }
.mission-trigger span { font-size: 0.7rem; font-weight: 900; letter-spacing: 3px; }
.arrow-down { 
  width: 24px; height: 12px; background: var(--accent); 
  clip-path: polygon(0 0, 100% 0, 50% 100%); margin-bottom: 10px;
  animation: bounce-arrow 2s infinite;
}
@keyframes bounce-arrow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

@media (max-width: 768px) {
  .central-hud { padding: 30px; width: 95%; }
  .hud-alignment-wrapper { margin-top: 10vh; }
  .pilot-name { font-size: 2.8rem; letter-spacing: -2px; }
  .bio-typing { font-size: 0.9rem; }
  .cf-stats-row { gap: 15px; }
  .stat-group .value { font-size: 1.1rem; }
  .chart-container { height: 70px; }
}
</style>
