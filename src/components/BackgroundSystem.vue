<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  currentIndex: number
}
const props = defineProps<Props>()

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="dynamic-bg">
    <!-- 基础网格 -->
    <div class="grid-overlay"></div>
    
    <!-- 动态浮动区块 -->
    <div 
      class="float-layer"
      :style="{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` }"
    >
      <div 
        v-for="i in 8" 
        :key="i" 
        :class="['shape', `shape-${i}`]"
        :style="{ 
          top: `${(i * 15) % 100}%`, 
          left: `${(i * 23) % 100}%`,
          transform: `rotate(${props.currentIndex * 45 + i * 20}deg) scale(${1 + (i % 3) * 0.2})`
        }"
      ></div>
    </div>

    <!-- 装饰性线条 -->
    <div class="circuit-lines"></div>
  </div>
</template>

<style scoped>
.dynamic-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--bg);
  pointer-events: none;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--text-mute) 1px, transparent 1px),
    linear-gradient(90deg, var(--text-mute) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.1;
}

.float-layer {
  position: absolute;
  inset: -50px;
  transition: transform 0.2s ease-out;
}

.shape {
  position: absolute;
  border: 2px solid var(--border);
  background: transparent;
  box-shadow: clamp(4px, 1vw, 6px) clamp(4px, 1vw, 6px) 0px var(--shadow);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  opacity: 0.12;
}

/* 生成不同形状 */
.shape:nth-child(odd) { width: clamp(30px, 8vw, 60px); height: clamp(30px, 8vw, 60px); border-radius: 0; }
.shape:nth-child(even) { width: clamp(20px, 5vw, 40px); height: clamp(20px, 5vw, 40px); border-radius: 50%; }
.shape:nth-child(3n) { width: clamp(40px, 10vw, 80px); height: clamp(10px, 3vw, 20px); border-radius: 100px; }

/* 关键帧漂浮动画 */
@keyframes drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(15px, -15px) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.shape {
  animation: drift 10s infinite ease-in-out;
}

.shape:nth-child(2n) { animation-duration: 15s; animation-delay: -2s; }
.shape:nth-child(3n) { animation-duration: 20s; animation-delay: -5s; }

.circuit-lines {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, transparent 49.5%, var(--accent) 49.5%, var(--accent) 50.5%, transparent 50.5%),
    linear-gradient(transparent 49.5%, var(--accent) 49.5%, var(--accent) 50.5%, transparent 50.5%);
  background-size: 20% 20%;
  opacity: 0.03;
}
</style>
