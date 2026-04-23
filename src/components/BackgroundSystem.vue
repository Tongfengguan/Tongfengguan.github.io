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

// 主题背景色映射
const bgGradient = computed(() => {
  if (props.theme === 'unit00') return 'radial-gradient(circle at center, #fffbeb 0%, #ffffff 100%)'
  if (props.theme === 'unit02') return 'radial-gradient(circle at center, #1a0505 0%, #050505 100%)'
  return 'radial-gradient(circle at center, #1a1033 0%, #030303 100%)'
})

// 六边形碎片颜色映射
const fragmentColor = computed(() => {
  if (props.theme === 'unit00') return '#eab308' // 黄
  if (props.theme === 'unit02') return '#ef4444' // 红
  return '#22c55e' // 绿 (初号机)
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
    <!-- 六边形网格底层 -->
    <div class="honeycomb-overlay" :style="{ '--line-color': fragmentColor }"></div>
    
    <!-- 精准对齐的 AT Field 阵列 -->
    <div 
      class="float-layer"
      :style="{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` }"
    >
      <div 
        v-for="i in 15" 
        :key="i" 
        class="at-fragment"
        :style="{ 
          top: `${Math.floor((i-1) / 5) * 25 + 10}%`, 
          left: `${((i-1) % 5) * 20 + ((Math.floor((i-1)/5) % 2) * 10)}%`,
          '--rot': `${props.currentIndex * 30 + i * 10}deg`,
          '--delay': `${-(i * 1.5)}s`,
          '--color': fragmentColor,
          '--scale': `${0.4 + (i % 3) * 0.15}`
        }"
      >
        <!-- 完美的六边形 -->
        <div class="perfect-hex"></div>
      </div>
    </div>

    <!-- 动态扫描线 -->
    <div class="scan-line" :style="{ '--scan-color': fragmentColor }"></div>
  </div>
</template>

<style scoped>
.dynamic-bg {
  position: fixed; inset: 0; z-index: 0; overflow: hidden;
  transition: background 0.8s ease;
  pointer-events: none;
}

.honeycomb-overlay {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='currentColor' stroke-width='1' stroke-opacity='0.08'/%3E%3C/svg%3E");
  background-size: 56px 100px;
  color: var(--line-color);
  transition: color 0.8s ease;
}

.float-layer { position: absolute; inset: 0; transition: transform 0.2s ease-out; }

.at-fragment {
  position: absolute;
  transform: rotate(var(--rot)) scale(var(--scale));
  opacity: 0.15;
  animation: float-at 10s infinite ease-in-out var(--delay);
}

/* 使用 clip-path 绘制完美的六边形 */
.perfect-hex {
  width: 80px; height: 90px;
  background: var(--color);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: background 0.8s ease;
  /* 镂空效果：嵌套一个小六边形 */
  display: flex; align-items: center; justify-content: center;
}
.perfect-hex::after {
  content: '';
  width: 85%; height: 85%;
  background: var(--bg); /* 镂空背景同步主色 */
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: background 0.8s ease;
}

@keyframes float-at {
  0%, 100% { transform: translate(0, 0) rotate(var(--rot)) scale(var(--scale)); }
  50% { transform: translate(15px, -15px) rotate(calc(var(--rot) + 8deg)); }
}

.scan-line {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--scan-color) 50%, transparent 100%);
  background-size: 100% 4px;
  opacity: 0.04;
  animation: scan 12s linear infinite;
  transition: background 0.8s ease;
}
@keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
</style>
