<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  currentIndex: number
  theme: 'unit00' | 'unit01' | 'unit02'
}
const props = defineProps<Props>()

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20
}

// 主题颜色配置
const themeColors = computed(() => {
  if (props.theme === 'unit00') return { bg: '#ffffff', line: '#eab308', silhouette: '#eab308' }
  if (props.theme === 'unit02') return { bg: '#050505', line: '#ef4444', silhouette: '#ef4444' }
  return { bg: '#030303', line: '#9333ea', silhouette: '#22c55e' } // unit01
})

// 动态生成 SVG 网格
const honeycombSvg = computed(() => {
  const color = encodeURIComponent(themeColors.value.line)
  return `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${color}' stroke-width='1.5' stroke-opacity='0.25'/%3E%3C/svg%3E")`
})

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="dynamic-bg" :style="{ background: props.theme === 'unit00' ? '#fff' : '#030303' }">
    <!-- 背景网格 -->
    <div class="honeycomb-overlay" :style="{ backgroundImage: honeycombSvg }"></div>
    
    <!-- 动态背景剪影 (机体侧影) -->
    <div class="silhouette-container" :style="{ color: themeColors.silhouette, transform: `translate3d(${mouseX * -0.8}px, ${mouseY * -0.8}px, 0)` }">

      <!-- 初号机 Blueprint (Unit-01) -->
      <svg v-if="props.theme === 'unit01'" class="mecha-svg" viewBox="0 0 400 400">
        <!-- 独角 -->
        <polygon points="190,40 210,40 205,140 195,140" fill="none" stroke="currentColor" stroke-width="2"/>
        <!-- 额头 -->
        <polygon points="195,140 205,140 240,200 160,200" fill="none" stroke="currentColor" stroke-width="2"/>
        <!-- 锐利双眼 -->
        <polygon points="130,220 170,240 130,250" fill="none" stroke="currentColor" stroke-width="3"/>
        <polygon points="270,220 230,240 270,250" fill="none" stroke="currentColor" stroke-width="3"/>
        <!-- 暴走下颚 -->
        <polygon points="160,280 240,280 220,360 180,360" fill="none" stroke="currentColor" stroke-width="2"/>
        <line x1="180" y1="360" x2="220" y2="360" stroke="currentColor" stroke-width="5" />
        <!-- 侧装甲 -->
        <path d="M160,200 L100,150 L80,250 L140,280 Z" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M240,200 L300,150 L320,250 L260,280 Z" fill="none" stroke="currentColor" stroke-width="2"/>
        <!-- 科技辅助线与定位圈 -->
        <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" stroke-width="1" stroke-dasharray="5,5" opacity="0.6"/>
        <line x1="50" y1="240" x2="350" y2="240" stroke="currentColor" stroke-width="1" stroke-dasharray="3,7" opacity="0.4"/>
        <circle cx="200" cy="220" r="150" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="10,20" opacity="0.4"/>
        <circle cx="200" cy="220" r="130" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/>
        <text x="10" y="390" class="svg-text">EVA_01_TEST_TYPE // SYNC_RATE: 400% [BERSERK]</text>
      </svg>

      <!-- 零号机 Blueprint (Unit-00) -->
      <svg v-if="props.theme === 'unit00'" class="mecha-svg" viewBox="0 0 400 400">
        <!-- 圆顶头部 -->
        <path d="M130,150 C130,60 270,60 270,150" fill="none" stroke="currentColor" stroke-width="3"/>
        <rect x="130" y="150" width="140" height="100" fill="none" stroke="currentColor" stroke-width="3"/>
        <!-- 独眼传感器 -->
        <circle cx="200" cy="200" r="35" fill="none" stroke="currentColor" stroke-width="4"/>
        <circle cx="200" cy="200" r="12" fill="currentColor"/>
        <!-- 基础下颚 -->
        <polygon points="150,250 250,250 230,320 170,320" fill="none" stroke="currentColor" stroke-width="2"/>
        <!-- 顶部天线 -->
        <rect x="185" y="40" width="30" height="40" fill="none" stroke="currentColor" stroke-width="2"/>
        <line x1="200" y1="10" x2="200" y2="40" stroke="currentColor" stroke-width="3"/>
        <!-- 科技辅助线 -->
        <line x1="200" y1="80" x2="200" y2="340" stroke="currentColor" stroke-width="1" stroke-dasharray="5,5" opacity="0.6"/>
        <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4,10" opacity="0.4"/>
        <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,5" opacity="0.6"/>
        <text x="10" y="390" class="svg-text">EVA_00_PROTO_TYPE // STATUS: NORMAL</text>
      </svg>

      <!-- 二号机 Blueprint (Unit-02) -->
      <svg v-if="props.theme === 'unit02'" class="mecha-svg" viewBox="0 0 400 400">
        <!-- 几何头部装甲 -->
        <polygon points="130,100 270,100 290,180 110,180" fill="none" stroke="currentColor" stroke-width="3"/>
        <polygon points="110,180 290,180 270,260 130,260" fill="none" stroke="currentColor" stroke-width="3"/>
        <!-- 四眼配置 -->
        <circle cx="160" cy="140" r="14" fill="none" stroke="currentColor" stroke-width="3"/>
        <circle cx="240" cy="140" r="14" fill="none" stroke="currentColor" stroke-width="3"/>
        <circle cx="150" cy="220" r="14" fill="none" stroke="currentColor" stroke-width="3"/>
        <circle cx="250" cy="220" r="14" fill="none" stroke="currentColor" stroke-width="3"/>
        <circle cx="160" cy="140" r="4" fill="currentColor" opacity="0.5"/>
        <circle cx="240" cy="140" r="4" fill="currentColor" opacity="0.5"/>
        <circle cx="150" cy="220" r="4" fill="currentColor" opacity="0.5"/>
        <circle cx="250" cy="220" r="4" fill="currentColor" opacity="0.5"/>
        <!-- 侧部延伸 -->
        <path d="M110,180 L70,180 L70,260 L130,260" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M290,180 L330,180 L330,260 L270,260" fill="none" stroke="currentColor" stroke-width="2"/>
        <!-- 锐利下颚 -->
        <polygon points="130,260 270,260 220,340 180,340" fill="none" stroke="currentColor" stroke-width="2"/>
        <!-- 科技辅助线 -->
        <line x1="200" y1="50" x2="200" y2="350" stroke="currentColor" stroke-width="1" stroke-dasharray="5,5" opacity="0.6"/>
        <line x1="50" y1="180" x2="350" y2="180" stroke="currentColor" stroke-width="1" stroke-dasharray="8,8" opacity="0.4"/>
        <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/>
        <text x="10" y="390" class="svg-text">EVA_02_PRODUCTION_MODEL // ASUKA_STRIKES!</text>
      </svg>
    </div>

    <!-- 巨型文字背板：加深颜色 -->
    <div class="background-label-layer" :style="{ color: themeColors.line, transform: `translate3d(${mouseX * -0.3}px, ${mouseY * -0.3}px, 0)` }">
      <div class="giant-code">{{ props.theme.toUpperCase() }}</div>
    </div>

    <!-- AT Field 阵列 -->
    <div class="float-layer" :style="{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` }">
      <div v-for="i in 15" :key="i" class="at-fragment"
        :style="{ 
          top: `${Math.floor((i-1) / 5) * 25 + 10}%`, 
          left: `${((i-1) % 5) * 20 + ((Math.floor((i-1)/5) % 2) * 10)}%`,
          '--rot': `${props.currentIndex * 30 + i * 10}deg`,
          '--delay': `${-(i * 1.5)}s`,
          '--color': themeColors.silhouette,
          '--scale': `${0.4 + (i % 3) * 0.15}`
        }">
        <div class="perfect-hex"></div>
      </div>
    </div>

    <div class="scan-line" :style="{ background: `linear-gradient(to bottom, transparent, ${themeColors.line} 50%, transparent)` }"></div>
  </div>
</template>

<style scoped>
.dynamic-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; transition: 0.8s; pointer-events: none; }
.honeycomb-overlay { position: absolute; inset: 0; background-size: 56px 100px; transition: 0.5s; opacity: 1; }

/* 机体剪影样式 */
.silhouette-container {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 1; opacity: 0.15; /* 提升可见度 */
  transition: transform 0.2s ease-out, color 0.8s;
}
.mecha-svg { width: 60vw; height: 60vw; max-width: 800px; }
.svg-text { font-family: 'Share Tech Mono', monospace; font-size: 24px; font-weight: 900; fill: currentColor; }

/* 巨型背板文字：加深颜色 */
.background-label-layer {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 0; opacity: 0.1; /* 显著提升背景文字对比度 */
}
.giant-code {
  font-family: 'Arial Black', sans-serif;
  font-size: 35vw; font-weight: 900;
  letter-spacing: -2vw; user-select: none;
}

.float-layer { position: absolute; inset: 0; transition: transform 0.2s ease-out; z-index: 3; }
.at-fragment { position: absolute; transform: rotate(var(--rot)) scale(var(--scale)); opacity: 0.2; animation: float-at 10s infinite ease-in-out var(--delay); }
.perfect-hex { width: 80px; height: 90px; background: var(--color); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); transition: 0.8s; display: flex; align-items: center; justify-content: center; }
.perfect-hex::after { content: ''; width: 88%; height: 88%; background: rgba(0,0,0,0.9); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }

@keyframes float-at { 0%, 100% { transform: translate(0, 0) rotate(var(--rot)) scale(var(--scale)); } 50% { transform: translate(15px, -15px) rotate(calc(var(--rot) + 8deg)); } }
.scan-line { position: absolute; inset: 0; background-size: 100% 12px; opacity: 0.05; animation: scan 15s linear infinite; }
@keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
</style>
