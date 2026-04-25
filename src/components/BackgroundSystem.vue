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
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 15
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 15
}

// 1. 核心：背景底色随主题动态平滑切换
const bgGradient = computed(() => {
  if (props.theme === 'unit00') return 'radial-gradient(circle at center, #fffbeb 0%, #ffffff 100%)' // 零号机亮白
  if (props.theme === 'unit02') return 'radial-gradient(circle at center, #1a0505 0%, #050505 100%)' // 二号机深红黑
  return 'radial-gradient(circle at center, #1a1033 0%, #030303 100%)' // 初号机深紫黑
})

// 2. 核心：网格线与碎片颜色同步
const themeColors = computed(() => {
  if (props.theme === 'unit00') return { line: '#eab308', hex: '#eab308' }
  if (props.theme === 'unit02') return { line: '#ef4444', hex: '#ef4444' }
  return { line: '#9333ea', hex: '#22c55e' } // 初号机紫线绿块
})

// 动态生成 SVG 网格字符串
const honeycombSvg = computed(() => {
  const color = encodeURIComponent(themeColors.value.line)
  return `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${color}' stroke-width='1.5' stroke-opacity='0.15'/%3E%3C/svg%3E")`
})

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="dynamic-bg" :style="{ background: bgGradient }">
    <!-- 全息晕影层：增强屏幕边缘质感 -->
    <div class="vignette-overlay"></div>

    <!-- 六边形网格层 -->
    <div class="honeycomb-overlay" :style="{ backgroundImage: honeycombSvg }"></div>
    
    <!-- 装饰性 HUD 数据层 -->
    <div class="data-layer" :style="{ color: themeColors.line, transform: `translate3d(${mouseX * -0.5}px, ${mouseY * -0.5}px, 0)` }">
      <div class="coord-cross top-left">+</div>
      <div class="coord-cross top-right">+</div>
      <div class="coord-cross bottom-left">+</div>
      <div class="coord-cross bottom-right">+</div>
      <div class="hex-stream">0x53 0x59 0x4E 0x43 0x5F 0x4F 0x4B // EVA_ACTIVE</div>
    </div>

    <!-- 背景机体编号水印 -->
    <div class="giant-label-layer" :style="{ color: themeColors.line, transform: `translate3d(${mouseX * -0.2}px, ${mouseY * -0.2}px, 0)` }">
      <div class="giant-text">{{ props.theme.toUpperCase() }}</div>
    </div>

    <!-- AT Field 碎片阵列层 -->
    <div class="float-layer" :style="{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` }">
      <div v-for="i in 15" :key="i" class="at-fragment"
        :style="{ 
          top: `${Math.floor((i-1) / 5) * 25 + 10}%`, 
          left: `${((i-1) % 5) * 20 + ((Math.floor((i-1)/5) % 2) * 10)}%`,
          '--rot': `${props.currentIndex * 30 + i * 10}deg`,
          '--delay': `${-(i * 1.5)}s`,
          '--color': themeColors.hex,
          '--scale': `${0.4 + (i % 3) * 0.15}`
        }">
        <div class="perfect-hex"></div>
      </div>
    </div>

    <!-- 动态扫描线：增强电子干扰感 -->
    <div class="scan-line" :style="{ background: `linear-gradient(to bottom, transparent, ${themeColors.hex} 50%, transparent)` }"></div>
  </div>
</template>

<style scoped>
.dynamic-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; transition: background 0.8s ease; pointer-events: none; }

.vignette-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%);
  z-index: 1; pointer-events: none; opacity: 0.6;
}

.honeycomb-overlay { position: absolute; inset: 0; background-size: 56px 100px; transition: 0.5s; opacity: 1; z-index: 0; }

.data-layer { position: absolute; inset: 40px; font-family: 'Share Tech Mono', monospace; opacity: 0.15; z-index: 5; transition: color 0.8s; }
.coord-cross { position: absolute; font-size: 20px; font-weight: 900; }
.top-left { top: 0; left: 0; } .top-right { top: 0; right: 0; }
.bottom-left { bottom: 0; left: 0; } .bottom-right { bottom: 0; right: 0; }
.hex-stream { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; white-space: nowrap; letter-spacing: 2px; }

.giant-label-layer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 0; opacity: 0.08; transition: color 0.8s; }
.giant-text { font-family: 'Arial Black', sans-serif; font-size: 35vw; font-weight: 900; letter-spacing: -2vw; user-select: none; }

.float-layer { position: absolute; inset: 0; transition: transform 0.2s ease-out; z-index: 10; }
.at-fragment { position: absolute; transform: rotate(var(--rot)) scale(var(--scale)); opacity: 0.15; animation: float-at 10s infinite ease-in-out var(--delay); }

.perfect-hex {
  width: 80px; height: 90px;
  background: var(--color);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: background 0.8s ease;
  display: flex; align-items: center; justify-content: center;
}
.perfect-hex::after {
  content: ''; width: 88%; height: 88%;
  background: rgba(10, 10, 10, 0.9);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

@keyframes float-at {
  0%, 100% { transform: translate(0, 0) rotate(var(--rot)) scale(var(--scale)); }
  50% { transform: translate(15px, -15px) rotate(calc(var(--rot) + 8deg)); }
}

.scan-line { 
  position: absolute; inset: 0; height: 12px; z-index: 20;
  opacity: 0.08; mix-blend-mode: overlay;
  animation: scan 10s linear infinite; transition: 0.8s; 
}
@keyframes scan { from { transform: translateY(-100vh); } to { transform: translateY(100vh); } }
</style>
