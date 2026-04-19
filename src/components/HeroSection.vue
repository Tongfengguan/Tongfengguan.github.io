<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  displayedBio: string
  cfRating: string | number
  cfSolved: string | number
  cfRank: string
  cfLoading: boolean
  isVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['scroll-down'])

const getRankColor = (rating: any) => {
  const r = Number(rating); if (isNaN(r)) return 'rank-gray'
  if (r < 1200) return 'rank-gray'; if (r < 1400) return 'rank-green'; if (r < 1600) return 'rank-cyan'
  if (r < 1900) return 'rank-blue'; if (r < 2100) return 'rank-violet'; if (r < 2400) return 'rank-orange'
  return 'rank-red'
}

const rankColorClass = computed(() => getRankColor(props.cfRating))
</script>

<template>
  <section class="page-section hero-view">
    <div class="hero-text" :class="{ 'visible': isVisible }">
      <h1 class="name">TFGKK</h1>
      <div class="typing-box">
        <span class="symbol">></span>
        <span class="text">{{ displayedBio }}</span>
        <span class="cursor">_</span>
      </div>
      <div class="cf-stats-row" v-if="!cfLoading">
        <div class="stat-item">
          <span class="val" :class="rankColorClass">{{ cfRating }}</span>
          <span class="lab">Rating</span>
        </div>
        <div class="stat-item">
          <span class="val">{{ cfSolved }}</span>
          <span class="lab">Solved</span>
        </div>
        <div class="stat-item">
          <span class="val" :class="rankColorClass">{{ cfRank }}</span>
          <span class="lab">Rank</span>
        </div>
      </div>
    </div>
    <div class="scroll-hint" role="button" aria-label="Scroll down to projects" tabindex="0" @click="emit('scroll-down')" @keydown.enter="emit('scroll-down')">
      <div class="mouse-icon"></div>
      <span>Scroll Down</span>
    </div>
  </section>
</template>

<style scoped>
.hero-view { 
  height: 100vh; 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
  padding: 0; 
  flex-direction: column; 
}

.hero-text { 
  width: 100%;
  text-align: center; 
  opacity: 0; 
  transform: translateY(30px); 
  transition: all 0.8s 0.3s; 
  margin-top: clamp(15vh, 20vh, 25vh);
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-text.visible { opacity: 1; transform: translateY(0); }

.name { 
  font-size: clamp(3rem, 12vw, 8rem); 
  font-weight: 950; 
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: -2px; 
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: clamp(4px, 1vw, 6px) clamp(4px, 1vw, 6px) 0px var(--accent);
}

.typing-box { 
  font-family: 'Courier New', monospace; 
  font-size: clamp(1rem, 3.5vw, 1.8rem); 
  background: var(--text-main);
  color: var(--bg);
  padding: 5px 12px;
  transform: rotate(-1deg);
  border: 2px solid var(--border);
  max-width: 90vw;
  word-break: break-all;
}

.cf-stats-row { 
  display: flex; 
  gap: clamp(10px, 4vw, 20px); 
  margin-top: clamp(30px, 8vw, 50px); 
  padding: 15px clamp(20px, 5vw, 40px); 
  background: var(--card-bg); 
  border: 3px solid var(--border);
  box-shadow: 8px 8px 0px var(--shadow);
  flex-wrap: wrap;
  justify-content: center;
}

.stat-item .val { font-size: clamp(1.1rem, 3vw, 1.5rem); font-weight: 800; color: var(--text-main); }
.stat-item .lab { font-size: 0.7rem; text-transform: uppercase; color: var(--text-mute); font-weight: 600; }

.scroll-hint { position: absolute; bottom: 45px; display: flex; flex-direction: column; align-items: center; color: var(--text-mute); cursor: pointer; }
.mouse-icon { width: 24px; height: 40px; border: 2.5px solid var(--text-mute); border-radius: 12px; position: relative; margin-bottom: 10px; }
.mouse-icon::after { content:''; width:5px; height:5px; background:var(--accent); position:absolute; left:50%; margin-left:-2.5px; top:8px; border-radius:50%; animation: m-scroll 2s infinite; }

.rank-gray { color: #808080; } 
.rank-green { color: #008000; } 
.rank-cyan { color: #03a89e; }
.rank-blue { color: #0000ff; } 
.rank-violet { color: #a0a; } 
.rank-orange { color: #ff8c00; }
.rank-red { color: #ff0000; }

@keyframes m-scroll { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(18px); opacity: 0; } }

@media (max-width: 600px) {
  .cf-stats-row { gap: 15px; padding: 12px 20px; }
  .hero-text { margin-top: 15vh; }
}
</style>
