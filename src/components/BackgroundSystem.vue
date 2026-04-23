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

const themeColors = computed(() => {
  if (props.theme === 'unit00') return { bg: '#ffffff', line: '#eab308', hex: '#eab308' }
  if (props.theme === 'unit02') return { bg: '#050505', line: '#ef4444', hex: '#ef4444' }
  return { bg: '#030303', line: '#9333ea', hex: '#22c55e' } // unit01
})

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
  <div class="dynamic-bg" :style="{ background: props.theme === 'unit00' ? '#fff' : '#030303' }">
    <!-- 基础网格 -->
    <div class="honeycomb-overlay" :style="{ backgroundImage: honeycombSvg }"></div>
    
    <!-- 装饰性 HUD 元素：坐标轴与十六进制数据 -->
    <div class="data-layer" :style="{ color: themeColors.line, transform: `translate3d(${mouseX * -0.5}px, ${mouseY * -0.5}px, 0)` }">
      <div class="coord-cross top-left">+</div>
      <div class="coord-cross top-right">+</div>
      <div class="coord-cross bottom-left">+</div>
      <div class="coord-cross bottom-right">+</div>
      
      <div class="hex-stream">
        0x53 0x59 0x4E 0x43 0x5F 0x4F 0x4B 0x0A
        0x45 0x56 0x41 0x5F 0x41 0x43 0x54 0x49 0x56 0x45
      </div>
    </div>

    <!-- 背景巨型文字水印 -->
    <div class="giant-label-layer" :style="{ color: themeColors.line, transform: `translate3d(${mouseX * -0.2}px, ${mouseY * -0.2}px, 0)` }">
      <div class="giant-text">{{ props.theme.toUpperCase() }}</div>
    </div>

    <!-- AT Field 阵列 -->
    <div class="float-layer" :style="{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` }">
      <div v-for="i in 12" :key="i" class="at-fragment"
        :style="{ 
          top: `${(i * 19) % 100}%`, 
          left: `${(i * 31) % 100}%`,
          '--rot': `${props.currentIndex * 30 + i * 15}deg`,
          '--delay': `${-(i * 1.5)}s`,
          '--color': themeColors.hex,
          '--scale': `${0.4 + (i % 3) * 0.1}`
        }">
        <div class="perfect-hex"></div>
      </div>
    </div>

    <div class="scan-line" :style="{ background: `linear-gradient(to bottom, transparent, ${themeColors.hex} 50%, transparent)` }"></div>
  </div>
</template>

<style scoped>
.dynamic-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; transition: 0.8s; pointer-events: none; }
.honeycomb-overlay { position: absolute; inset: 0; background-size: 56px 100px; opacity: 0.8; }

.data-layer {
  position: absolute; inset: 40px;
  font-family: 'Share Tech Mono', monospace;
  opacity: 0.15; z-index: 1;
}
.coord-cross { position: absolute; font-size: 20px; font-weight: 900; }
.top-left { top: 0; left: 0; } .top-right { top: 0; right: 0; }
.bottom-left { bottom: 0; left: 0; } .bottom-right { bottom: 0; right: 0; }

.hex-stream {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  font-size: 0.7rem; white-space: nowrap; letter-spacing: 2px;
}

.giant-label-layer {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 0; opacity: 0.08;
}
.giant-text {
  font-family: 'Arial Black', sans-serif;
  font-size: 35vw; font-weight: 900;
  letter-spacing: -2vw; user-select: none;
}

.float-layer { position: absolute; inset: 0; transition: transform 0.2s ease-out; z-index: 2; }
.at-fragment { position: absolute; transform: rotate(var(--rot)) scale(var(--scale)); opacity: 0.15; animation: float-at 10s infinite ease-in-out var(--delay); }
.perfect-hex { width: 80px; height: 90px; background: var(--color); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); transition: 0.8s; display: flex; align-items: center; justify-content: center; }
.perfect-hex::after { content: ''; width: 88%; height: 88%; background: rgba(0,0,0,0.9); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }

@keyframes float-at { 0%, 100% { transform: translate(0, 0) rotate(var(--rot)) scale(var(--scale)); } 50% { transform: translate(15px, -15px) rotate(calc(var(--rot) + 8deg)); } }
.scan-line { position: absolute; inset: 0; background-size: 100% 12px; opacity: 0.04; animation: scan 15s linear infinite; }
@keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
</style>
