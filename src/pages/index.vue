<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, CSSProperties } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectSection from '../components/ProjectSection.vue'
import LinksSection from '../components/LinksSection.vue'

// ================= 配置区 =================
const cfHandle = 'tfgkk'
const bios = ['算法蒟蒻梦想成为ACMer', 'Keep Coding, Keep Improving', 'While(true) { Study(); }', 'XCPC暴零选手', '铁牌收藏家']
const projects = [
  { title: '个人计划表', desc: '学习进度与长期目标管理', url: 'https://tongfengguan.github.io/Studyplan/', icon: 'calendar' },
  { title: 'Codeforces', desc: 'Codeforces 直达', url: 'https://codeforces.com/', icon: 'codeforces' }
]
const socials = [
  { name: 'GitHub', url: 'https://github.com/tongfengguan', icon: 'github' },
  { name: 'Email', url: 'mailto:1316187067@qq.com', icon: 'email' }
]

const myProjects = [
  {
    title: '智慧三农平台', subtitle: 'FarmerPlatform',
    desc: '全栈式“智慧三农”管理与服务平台，为农户和消费者提供政策资讯及业务管理方案。',
    tech: ['Java 21', 'Spring Boot', 'Vue 3', 'DeepSeek-V3'],
    features: ['AI 智能数据助手', '全栈现代化架构', '响应式三农主题', '高性能后端接口'],
    github: 'https://github.com/tongfengguan/FarmerPlatform'
  },
  {
    title: '学科竞赛报名系统', subtitle: 'Competition Manager',
    desc: '基于 Spring Boot 3 + Vue 3 的现代化全栈竞赛管理平台，实现数据运维与安全报名。',
    tech: ['Spring Boot 3', 'Vue 3', 'MySQL 8', 'EasyExcel'],
    features: ['自动化数据维护', '多重安全机制', '角色权限管理', '鲁棒性网络层'],
    github: 'https://github.com/tongfengguan/SchoolCompetitionWeb'
  },
  {
    title: '校园失物招领', subtitle: 'Campus Lost & Found',
    desc: '基于 Uni-app (Vue3) + Spring Boot 的前后端分离架构，提升校园物品寻回效率。',
    tech: ['Uni-app', 'Vue 3', 'Spring Boot', 'JWT'],
    features: ['发布寻物/招领', '物品列表浏览', '申请认领', '管理端审核'],
    github: 'https://github.com/tongfengguan/Campus-Lost-and-Found-System',
  }
]

// ================= 核心逻辑 =================

const isDark = ref(false)
const toggleDark = () => { isDark.value = !isDark.value }

// 修复 1: 打字机效果增加定时器管理，解决点击过快乱码
const displayedBio = ref('')
let currentTimer: any = null
const typeWriter = (text: string) => {
  if (currentTimer) clearTimeout(currentTimer)
  let index = 0
  displayedBio.value = ''
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

// Codeforces 数据获取
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
  } catch (e) {
    console.error(e)
  } finally {
    cfLoading.value = false
  }
}

// 页面滚动逻辑
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

// 修复 2: 增加移动端滑动支持
let touchStartY = 0
const handleTouchStart = (e: TouchEvent) => { 
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY 
  }
}
const handleTouchEnd = (e: TouchEvent) => {
  if (isAnimating.value) return
  if (e.changedTouches && e.changedTouches[0]) {
    const touchEndY = e.changedTouches[0].clientY
    const deltaY = touchStartY - touchEndY
    if (deltaY > 50) goToSection(currentIndex.value + 1)
    else if (deltaY < -50) goToSection(currentIndex.value - 1)
  }
}

// 修复 3: 布局自适应更新，增加窗口尺寸监听
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
    <!-- 背景系统 -->
    <div class="bg-system">
      <div class="grid-dot"></div>
      <div class="glow g1"></div>
      <div class="glow g2"></div>
    </div>
    
    <!-- 主题切换 -->
    <div class="theme-btn" @click="toggleDark">
      <div class="btn-inner" :class="{ 'is-dark': isDark }">
        <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </div>
    </div>

    <!-- 头像 -->
    <div class="avatar-fixed-box" :style="avatarStyle">
      <div class="avatar-ring" @click="changeBio">
        <img src="/avatar.png" alt="Avatar" />
        <div class="ring-glow"></div>
      </div>
    </div>

    <!-- 页面滚动容器 -->
    <div class="page-wrapper" :style="{ transform: `translate3d(0, -${currentIndex * 100}vh, 0)` }">
      
      <!-- 第一屏：Hero View -->
      <HeroSection 
        :displayedBio="displayedBio"
        :cfRating="cfRating"
        :cfSolved="cfSolved"
        :cfRank="cfRank"
        :cfLoading="cfLoading"
        :isVisible="currentIndex === 0"
        @scroll-down="goToSection(1)"
      />

      <!-- 项目屏 -->
      <ProjectSection 
        v-for="(project, index) in myProjects" 
        :key="index"
        :project="project"
        :index="index"
        :isVisible="currentIndex === index + 1"
      />

      <!-- 链接屏 -->
      <LinksSection 
        :projects="projects"
        :socials="socials"
        :isVisible="currentIndex === totalSections - 1"
      />
    </div>

    <!-- 侧边导航 -->
    <div class="side-nav">
      <div 
        v-for="i in totalSections" 
        :key="i" 
        class="nav-dot" 
        :class="{ 'active': currentIndex === i-1 }" 
        @click="goToSection(i-1)"
      ></div>
    </div>
  </main>
</template>

<style scoped>
.page-viewport {
  --bg: #f8fafc; --text-main: #0f172a; --text-mute: #475569; --accent: #2563eb;
  --glass-bg: rgba(255, 255, 255, 0.9); --glass-border: rgba(203, 213, 225, 0.8);
  height: 100vh; width: 100vw; overflow: hidden; position: relative; background: var(--bg); transition: 0.5s;
}
.page-viewport.dark-theme {
  --bg: #030712; --text-main: #f8fafc; --text-mute: #94a3b8; --accent: #38bdf8;
  --glass-bg: rgba(17, 24, 39, 0.85); --glass-border: rgba(51, 65, 85, 0.8);
}

.page-wrapper { height: 100vh; width: 100%; transition: transform 0.85s cubic-bezier(0.645, 0.045, 0.355, 1); will-change: transform; }

.bg-system { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.grid-dot { position: absolute; inset: 0; background-image: radial-gradient(var(--text-mute) 0.5px, transparent 0.5px); background-size: 30px 30px; opacity: 0.12; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.25; }
.g1 { width: 45vw; height: 45vw; background: var(--accent); top: -10%; right: -5%; }
.g2 { width: 55vw; height: 55vw; background: #6366f1; bottom: -15%; left: -10%; }

.theme-btn { position: fixed; top: 25px; right: 25px; z-index: 1100; width: 46px; height: 46px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); }
.btn-inner svg { width: 22px; height: 22px; color: var(--accent); }

.avatar-fixed-box { pointer-events: none; }
.avatar-ring { width: 140px; height: 140px; border-radius: 50%; border: 4px solid var(--glass-bg); overflow: hidden; position: relative; box-shadow: 0 12px 30px rgba(0,0,0,0.15); cursor: pointer; pointer-events: auto; }
.avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
.ring-glow { position: absolute; inset: -10px; background: var(--accent); filter: blur(20px); opacity: 0; transition: 0.3s; }
.avatar-ring:hover .ring-glow { opacity: 0.35; }

.side-nav { position: fixed; right: 35px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 18px; z-index: 100; }
.nav-dot { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid var(--accent); cursor: pointer; transition: 0.4s; opacity: 0.5; }
.nav-dot.active { height: 35px; border-radius: 6px; background: var(--accent); opacity: 1; }

@media (max-width: 900px) { 
  .avatar-fixed-box { display: none; } 
  .side-nav { right: 15px; }
}
</style>
