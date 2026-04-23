<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, CSSProperties } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectSection from '../components/ProjectSection.vue'
import LinksSection from '../components/LinksSection.vue'
import BackgroundSystem from '../components/BackgroundSystem.vue'

// ================= 配置区 =================
const cfHandle = 'tfgkk'
const bios = ['算法蒟蒻梦想成为ACMer', 'Keep Coding, Keep Improving', 'While(true) { Study(); }', 'XCPC暴零选手', '铁牌收藏家']

const defaultBookmarks = [
  {
    category: '动物好伙伴',
    links: [
      { title: 'Google Gemini', desc: 'Google 的多模态 AI 模型', url: 'https://gemini.google.com/' },
      { title: 'ChatGPT', desc: 'OpenAI 的智能对话工具', url: 'https://chat.openai.com/' },
      { title: 'Grok', desc: 'xAI 打造的实时联网 AI', url: 'https://grok.com/' }
    ]
  },
  {
    category: '刷题喵',
    links: [
      { title: 'Codeforces', desc: '全球顶尖算法竞赛平台', url: 'https://codeforces.com/' },
      { title: 'AtCoder', desc: '高质量日系算法周赛', url: 'https://atcoder.jp/' },
      { title: '牛客竞赛OJ', desc: '国内领先的算法竞赛平台', url: 'https://ac.nowcoder.com/' }
    ]
  }
]

const bookmarks = ref(defaultBookmarks)

const myProjects = [
  {
    title: '智慧三农平台', subtitle: 'FarmerPlatform',
    desc: '全栈式“智慧三农”管理与服务平台，为农户和消费者提供政策资讯及业务管理方案。',
    tech: ['Java 21', 'Spring Boot', 'Vue 3', 'DeepSeek-V3'],
    features: ['AI 智能数据助手', '全栈现代化架构', '响应式三农主题', '高性能后端接口', '大数据可视化', '分布式系统设计'],
    image: 'https://images.unsplash.com/photo-1451187580459-434902bd0c0e?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/tongfengguan/FarmerPlatform'
  },
  {
    title: '学科竞赛报名系统', subtitle: 'Competition Manager',
    desc: '基于 Spring Boot 3 + Vue 3 的现代化全栈竞赛管理平台，实现数据运维与安全报名。',
    tech: ['Spring Boot 3', 'Vue 3', 'MySQL 8', 'EasyExcel'],
    features: ['自动化数据维护', '多重安全机制', '角色权限管理', '鲁棒性网络层', 'Excel 异步导出', '高并发报名队列'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/tongfengguan/SchoolCompetitionWeb'
  },
  {
    title: '校园失物招领', subtitle: 'Campus Lost & Found',
    desc: '基于 Uni-app (Vue3) + Spring Boot 的前后端分离架构，提升校园物品寻回效率。',
    tech: ['Uni-app', 'Vue 3', 'Spring Boot', 'JWT'],
    features: ['发布寻物/招领', '物品列表浏览', '申请认领', '管理端审核', '地图位置标注', '实时消息推送'],
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/tongfengguan/Campus-Lost-and-Found-System',
  }
]

const socials = [
  { name: 'GitHub', url: 'https://github.com/tongfengguan', icon: 'github' },
  { name: 'Email', url: 'mailto:1316187067@qq.com', icon: 'email' }
]

// ================= 核心逻辑 =================

type Theme = 'unit00' | 'unit01' | 'unit02'
const currentTheme = ref<Theme>('unit01')
const isMenuOpen = ref(false)

const themes: { name: Theme; label: string; color: string }[] = [
  { name: 'unit00', label: '零号機 · PROTO', color: '#eab308' },
  { name: 'unit01', label: '初号機 · TEST', color: '#9333ea' },
  { name: 'unit02', label: '弐号機 · PROD', color: '#ef4444' }
]

const setTheme = (name: Theme) => {
  currentTheme.value = name
  isMenuOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (isMenuOpen.value && !(e.target as HTMLElement).closest('.theme-selector')) {
    isMenuOpen.value = false
  }
}

const displayedBio = ref('')
let currentTimer: any = null
const typeWriter = (text: string) => {
  if (currentTimer) clearTimeout(currentTimer)
  let index = 0; displayedBio.value = ''
  const type = () => {
    if (index < text.length) {
      displayedBio.value += text.charAt(index)
      index++
      currentTimer = setTimeout(type, 100)
    }
  }
  type()
}

const changeBio = () => {
  const next = bios[Math.floor(Math.random() * bios.length)]
  if (next) typeWriter(next)
}

const cfRating = ref('--'), cfSolved = ref('--'), cfRank = ref('Unrated'), cfLoading = ref(true)
const cfHistory = ref<number[]>([])

const fetchCFData = async () => {
  try {
    const [info, status, rating] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`).then(r => r.json()),
      fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`).then(r => r.json()),
      fetch(`https://codeforces.com/api/user.rating?handle=${cfHandle}`).then(r => r.json())
    ])
    if (info.status === 'OK') {
      cfRating.value = info.result[0].rating || 0
      cfRank.value = info.result[0].rank || 'Unrated'
    }
    if (status.status === 'OK') {
      cfSolved.value = new Set(status.result.filter((s: any) => s.verdict === 'OK').map((s: any) => `${s.problem.contestId}${s.problem.index}`)).size.toString()
    }
    if (rating.status === 'OK') {
      cfHistory.value = rating.result.slice(-20).map((r: any) => r.newRating)
    }
  } catch (e) { console.error(e) } finally { cfLoading.value = false }
}

const currentIndex = ref(0)
const totalSections = myProjects.length + 2
const isAnimating = ref(false)

const goToSection = (index: number) => {
  if (isAnimating.value || index < 0 || index >= totalSections) return
  isAnimating.value = true
  currentIndex.value = index
  setTimeout(() => { isAnimating.value = false }, 850)
}

const handleWheel = (e: WheelEvent) => {
  if (isAnimating.value) return
  if (e.deltaY > 20) goToSection(currentIndex.value + 1)
  else if (e.deltaY < -20) goToSection(currentIndex.value - 1)
}

let touchStartY = 0
const handleTouchStart = (e: TouchEvent) => { if (e.touches[0]) touchStartY = e.touches[0].clientY }
const handleTouchEnd = (e: TouchEvent) => {
  if (isAnimating.value) return
  const touchEnd = e.changedTouches?.[0]
  if (!touchEnd) return
  const touchEndY = touchEnd.clientY
  const deltaY = touchStartY - touchEndY
  if (Math.abs(deltaY) > 50) {
    if (deltaY > 0) goToSection(currentIndex.value + 1)
    else goToSection(currentIndex.value - 1)
  }
}

const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const updateDimensions = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

const avatarStyle = computed((): CSSProperties => {
  const active = currentIndex.value > 0
  // 核心改动：增大初始头像尺寸 (1.3倍放大) 和 缩小后的比例 (从 0.35 提升到 0.5)
  const scale = active ? 0.5 : 1.3
  const currentX = active ? 85 : windowWidth.value / 2
  const currentY = active ? 85 : windowHeight.value * 0.28
  return {
    position: 'fixed', left: '0', top: '0',
    transform: `translate3d(${Math.round(currentX)}px, ${Math.round(currentY)}px, 0) scale(${scale}) translate(-50%, -50%)`,
    transition: 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
    zIndex: 2000, willChange: 'transform'
  }
})

onMounted(() => {
  if (bios[0]) typeWriter(bios[0])
  fetchCFData()
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
  window.addEventListener('resize', updateDimensions)
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('resize', updateDimensions)
  window.removeEventListener('click', handleClickOutside)
  if (currentTimer) clearTimeout(currentTimer)
})
</script>

<template>
  <main class="page-viewport" :class="[currentTheme + '-theme']">
    <BackgroundSystem :currentIndex="currentIndex" :theme="currentTheme" />
    
    <div class="eva-overlay" :class="{ 'scrolled-down': currentIndex > 0 }">
      <div class="top-bar">
        <div class="magi-status">MAGI SYSTEM: <span class="blink">ONLINE</span></div>
        <div class="sync-rate">SYNC RATE: {{ currentTheme === 'unit01' ? '400%' : '100%' }}</div>
      </div>
      <div class="bottom-bar">
        <div class="nerv-label" style="text-transform: uppercase;">{{ currentTheme }} SPECIFICATIONS</div>
        <div class="emergency-code">STATUS: {{ currentTheme === 'unit01' ? 'BERSERK' : 'NORMAL' }}</div>
      </div>
    </div>

    <div class="theme-selector">
      <button class="theme-trigger" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen">
        <div class="btn-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
        <span class="trigger-label">UNIT SELECT</span>
        <svg class="chevron" :class="{ 'open': isMenuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M6 9l6 6 6-6"></path></svg>
      </button>
      
      <transition name="menu-slide">
        <div v-if="isMenuOpen" class="theme-menu">
          <button v-for="t in themes" :key="t.name" class="menu-item" :class="{ 'active': currentTheme === t.name }" @click="setTheme(t.name)">
            <span class="item-dot" :style="{ background: t.color }"></span>
            {{ t.label }}
          </button>
        </div>
      </transition>
    </div>

    <div class="avatar-fixed-box" :style="avatarStyle">
      <div class="avatar-ring" role="button" aria-label="Change bio text" tabindex="0" @click="changeBio" @keydown.enter="changeBio">
        <img src="/avatar.png" alt="Avatar" />
        <div class="ring-glow-aura"></div>
      </div>
    </div>

    <div class="page-wrapper" :style="{ transform: `translate3d(0, -${currentIndex * 100}vh, 0)` }">
      <HeroSection class="layout-section" :displayedBio="displayedBio" :cfRating="cfRating" :cfSolved="cfSolved" :cfRank="cfRank" :cfLoading="cfLoading" :cfHistory="cfHistory" :isVisible="currentIndex === 0" @scroll-down="goToSection(1)" />
      <ProjectSection v-for="(project, index) in myProjects" :key="index" class="layout-section" :project="project" :index="index" :isVisible="currentIndex === index + 1" />
      <LinksSection class="layout-section" :bookmarks="bookmarks" :socials="socials" :isVisible="currentIndex === totalSections - 1" />
    </div>

    <div class="side-nav" role="navigation" aria-label="Page sections">
      <div v-for="i in totalSections" :key="i" class="nav-dot" role="button" :aria-label="`Go to section ${i}`" tabindex="0" :class="{ 'active': currentIndex === i-1 }" @click="goToSection(i-1)" @keydown.enter="goToSection(i-1)"></div>
    </div>
  </main>
</template>

<style scoped>
/* ================= 全局对齐准则 ================= */
.page-viewport {
  --bg: #ffffff; --text-main: #000; --text-mute: #333; --accent: #a855f7; 
  --card-bg: #fff; --border: #000; --shadow: #000;
  --eva-orange: #f59e0b; --eva-green: #22c55e;
  height: 100vh; width: 100vw; overflow: hidden; position: relative; background: var(--bg); transition: background 0.5s;
}

.unit00-theme { --bg: #ffffff; --text-main: #1f2937; --text-mute: #6b7280; --accent: #eab308; --card-bg: #f3f4f6; --border: #4b5563; --shadow: #eab308; --eva-orange: #eab308; --eva-green: #9ca3af; }
.unit01-theme { --bg: #030303; --text-main: #ffffff; --text-mute: #666666; --accent: #9333ea; --eva-green: #22c55e; --eva-orange: #f59e0b; --card-bg: #0f0f0f; --border: #ffffff; --shadow: #9333ea; }
.unit02-theme { --bg: #050505; --text-main: #ffffff; --text-mute: #a1a1aa; --accent: #ef4444; --eva-green: #ffffff; --eva-orange: #ef4444; --card-bg: #1a1a1a; --border: #ef4444; --shadow: #ef4444; }

.theme-selector { position: fixed !important; top: 30px !important; right: 30px !important; z-index: 2500; }
.theme-trigger { background: var(--accent); border: 3px solid var(--border); box-shadow: 4px 4px 0px var(--shadow); display: flex; align-items: center; gap: 12px; padding: 0 15px; height: 50px; cursor: pointer; transition: 0.2s; }
.theme-trigger:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px var(--shadow); }
.trigger-label { font-weight: 950; font-size: 0.85rem; color: #000; letter-spacing: 1px; }
.btn-inner svg { width: 22px; height: 22px; color: #000; }
.chevron { width: 14px; height: 14px; color: #000; transition: 0.3s; }
.chevron.open { transform: rotate(180deg); }
.theme-menu { position: absolute; top: 60px; right: 0; width: 200px; background: var(--card-bg); border: 3px solid var(--border); box-shadow: 8px 8px 0px var(--shadow); padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.menu-item { background: transparent; border: 2px solid transparent; padding: 12px 15px; display: flex; align-items: center; gap: 12px; font-weight: 900; font-size: 0.75rem; color: var(--text-main); cursor: pointer; transition: 0.2s; text-align: left; }
.menu-item:hover { background: var(--accent); color: #000; border-color: var(--border); }
.menu-item.active { border-color: var(--border); background: rgba(128, 128, 128, 0.1); }
.item-dot { width: 10px; height: 10px; border: 2px solid var(--border); }

/* 头像中心对齐 & 尺寸升级 */
.avatar-ring { 
  width: 140px; height: 140px; border-radius: 50%; 
  position: relative; cursor: pointer; pointer-events: auto; transition: 0.3s;
  background: var(--card-bg); display: flex; align-items: center; justify-content: center;
}
.avatar-ring img { 
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%; 
  position: relative; z-index: 2; border: 4px solid var(--accent); box-sizing: border-box; 
}
.ring-glow-aura { 
  position: absolute; width: 100%; height: 100%; border-radius: 50%; 
  border: 3px solid var(--accent); opacity: 0.5; z-index: 1;
  animation: aura-pulse 2.5s infinite; box-sizing: border-box;
}
@keyframes aura-pulse { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.35); opacity: 0; } }

/* EVA 装饰层适配 */
.eva-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 1000; transition: opacity 0.5s, transform 0.5s; }
.eva-overlay.scrolled-down { opacity: 0.3; transform: scale(1.02); } /* 滚动时淡化装饰，专注内容 */

.top-bar, .bottom-bar { position: absolute; left: 0; right: 0; display: flex; justify-content: space-between; padding: 10px 30px; font-family: 'Courier New', monospace; font-weight: 900; font-size: 0.7rem; color: var(--eva-orange); background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border-bottom: 2px solid var(--eva-orange); }
.bottom-bar { bottom: 0; top: auto; border-bottom: 0; border-top: 2px solid var(--eva-orange); }
.blink { animation: blink-eva 1s step-end infinite; color: var(--eva-green); }
@keyframes blink-eva { 50% { opacity: 0; } }

.page-wrapper { display: flex; flex-direction: column; height: 100vh; width: 100%; transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1); will-change: transform; }
.layout-section { flex-shrink: 0; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; }
.side-nav { position: fixed; right: 40px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 15px; z-index: 100; }
.nav-dot { width: 14px; height: 14px; border: 2px solid var(--accent); cursor: pointer; transition: 0.3s; opacity: 0.4; transform: rotate(45deg); }
.nav-dot.active { background: var(--accent); opacity: 1; transform: rotate(45deg) scale(1.2); }

@media (max-width: 900px) { 
  .avatar-fixed-box { display: block !important; } /* 移动端重新启用头像 */
  .avatar-ring { width: 100px; height: 100px; }
  .eva-overlay { display: none; } 
  .theme-selector { top: 20px !important; right: 20px !important; }
  .side-nav { right: 15px; }
}
</style>
