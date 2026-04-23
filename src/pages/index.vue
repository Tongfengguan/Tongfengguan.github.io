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
    features: [
      'AI 智能数据助手', '全栈现代化架构', '响应式三农主题', 
      '高性能后端接口', '大数据可视化', '分布式系统设计'
    ], // 6个
    github: 'https://github.com/tongfengguan/FarmerPlatform'
  },
  {
    title: '学科竞赛报名系统', subtitle: 'Competition Manager',
    desc: '基于 Spring Boot 3 + Vue 3 的现代化全栈竞赛管理平台，实现数据运维与安全报名。',
    tech: ['Spring Boot 3', 'Vue 3', 'MySQL 8', 'EasyExcel'],
    features: [
      '自动化数据维护', '多重安全机制', '角色权限管理', 
      '鲁棒性网络层', 'Excel 异步导出', '高并发报名队列'
    ], // 6个
    github: 'https://github.com/tongfengguan/SchoolCompetitionWeb'
  },
  {
    title: '校园失物招领', subtitle: 'Campus Lost & Found',
    desc: '基于 Uni-app (Vue3) + Spring Boot 的前后端分离架构，提升校园物品寻回效率。',
    tech: ['Uni-app', 'Vue 3', 'Spring Boot', 'JWT'],
    features: [
      '发布寻物/招领', '物品列表浏览', '申请认领', 
      '管理端审核', '地图位置标注', '实时消息推送'
    ], // 6个
    github: 'https://github.com/tongfengguan/Campus-Lost-and-Found-System',
  }
]

const socials = [
  { name: 'GitHub', url: 'https://github.com/tongfengguan', icon: 'github' },
  { name: 'Email', url: 'mailto:1316187067@qq.com', icon: 'email' }
]

// ================= 核心逻辑 =================

const isDark = ref(true)
const toggleDark = () => { isDark.value = !isDark.value }

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
const fetchCFData = async () => {
  try {
    const [info, status] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`).then(r => r.json()),
      fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`).then(r => r.json())
    ])
    if (info.status === 'OK') {
      cfRating.value = info.result[0].rating || 0
      cfRank.value = info.result[0].rank || 'Unrated'
    }
    if (status.status === 'OK') {
      cfSolved.value = new Set(status.result.filter((s: any) => s.verdict === 'OK').map((s: any) => `${s.problem.contestId}${s.problem.index}`)).size.toString()
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
  const scale = active ? 0.4 : 1.0
  const currentX = active ? 60 : windowWidth.value / 2
  const currentY = active ? 60 : windowHeight.value * 0.4
  return {
    position: 'fixed', left: '0', top: '0',
    transform: `translate3d(${Math.round(currentX)}px, ${Math.round(currentY)}px, 0) scale(${scale}) translate(-50%, -50%)`,
    transition: 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
    zIndex: 1000, willChange: 'transform'
  }
})

onMounted(() => {
  if (bios[0]) typeWriter(bios[0])
  fetchCFData()
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
  window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('resize', updateDimensions)
  if (currentTimer) clearTimeout(currentTimer)
})
</script>

<template>
  <main class="page-viewport" :class="{ 'dark-theme': isDark }">
    <BackgroundSystem :currentIndex="currentIndex" />
    
    <!-- 主题切换 -->
    <button class="theme-btn" aria-label="Toggle dark mode" @click="toggleDark">
      <div class="btn-inner">
        <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 22L22 2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          <path d="M19 3v4M17 5h4"></path>
        </svg>
      </div>
    </button>

    <!-- 头像 -->
    <div class="avatar-fixed-box" :style="avatarStyle">
      <div class="avatar-ring" role="button" aria-label="Change bio text" tabindex="0" @click="changeBio" @keydown.enter="changeBio">
        <img src="/avatar.png" alt="Avatar" />
        <div class="ring-glow"></div>
      </div>
    </div>

    <!-- 页面滚动容器 -->
    <div class="page-wrapper" :style="{ transform: `translate3d(0, -${currentIndex * 100}vh, 0)` }">
      <HeroSection class="layout-section" :displayedBio="displayedBio" :cfRating="cfRating" :cfSolved="cfSolved" :cfRank="cfRank" :cfLoading="cfLoading" :isVisible="currentIndex === 0" @scroll-down="goToSection(1)" />
      <ProjectSection v-for="(project, index) in myProjects" :key="index" class="layout-section" :project="project" :index="index" :isVisible="currentIndex === index + 1" />
      <LinksSection class="layout-section" :bookmarks="bookmarks" :socials="socials" :isVisible="currentIndex === totalSections - 1" />
    </div>

    <!-- 侧边导航 -->
    <div class="side-nav" role="navigation" aria-label="Page sections">
      <div v-for="i in totalSections" :key="i" class="nav-dot" role="button" :aria-label="`Go to section ${i}`" tabindex="0" :class="{ 'active': currentIndex === i-1 }" @click="goToSection(i-1)" @keydown.enter="goToSection(i-1)"></div>
    </div>
  </main>
</template>

<style scoped>
.page-viewport { --bg: #ffffff; --text-main: #000000; --text-mute: #333333; --accent: #a855f7; --card-bg: #ffffff; --border: #000000; --shadow: #000000; height: 100vh; width: 100vw; overflow: hidden; position: relative; background: var(--bg); transition: 0.5s; }
.page-viewport.dark-theme { --bg: #0f0f0f; --text-main: #ffffff; --text-mute: #a1a1aa; --accent: #22d3ee; --card-bg: #1a1a1a; --border: #ffffff; --shadow: var(--accent); }
.page-wrapper { 
  display: flex;
  flex-direction: column;
  height: 100vh; 
  width: 100%; 
  transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1); 
  will-change: transform; 
}

.layout-section {
  flex-shrink: 0;
  width: 100%;
  height: 100vh;
}
.theme-btn { position: fixed; top: 30px; right: 30px; z-index: 1100; width: 50px; height: 50px; background: var(--accent); border: 3px solid var(--border); box-shadow: 4px 4px 0px var(--shadow); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.theme-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--shadow); }
.avatar-fixed-box { pointer-events: none; }
.avatar-ring { width: 140px; height: 140px; border: 4px solid var(--border); box-shadow: 8px 8px 0px var(--shadow); overflow: hidden; position: relative; cursor: pointer; pointer-events: auto; transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.avatar-ring:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0px var(--shadow); }
.avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
.side-nav { position: fixed; right: 35px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 18px; z-index: 100; }
.nav-dot { position: relative; width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid var(--accent); cursor: pointer; transition: 0.3s ease-out; opacity: 0.5; }
.nav-dot::after { content: ''; position: absolute; inset: -16px; }
.nav-dot.active { height: 35px; border-radius: 6px; background: var(--accent); opacity: 1; }
.nav-dot:focus-visible, .theme-btn:focus-visible, .avatar-ring:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
@media (max-width: 900px) { .avatar-fixed-box { display: none; } .side-nav { right: 15px; } }
</style>
