<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MyProjects from '../components/MyProjects.vue'
import ProjectLinks from '../components/ProjectLinks.vue'
// ================= 配置区 =================
const cfHandle = 'tfgkk' // 🔴 记得修改这里为你的 Codeforces ID

const projects = [
  {
    title: '个人计划表',
    desc: '学习进度与长期目标管理',
    url: 'https://tongfengguan.github.io/Studyplan/',
    icon: 'calendar',
  },
  {
    title: 'Codeforces',
    desc: 'Codeforces 直达',
    url: 'https://codeforces.com/',
    icon: 'codeforces',
  },
]

const socials = [
  { name: 'GitHub', url: 'https://github.com/tongfengguan', icon: 'github' },
  { name: 'Email', url: 'mailto:1316187067@qq.com', icon: 'email' },
]

const bios = [
  '算法蒟蒻梦想成为ACMer',
  'Keep Coding, Keep Improving',
  'While(true) { Study(); }',
  'XCPC暴零选手',
  '铁牌收藏家',
]

// 项目展示
const myProjects = [
  {
    title: '学校学科竞赛报名管理系统',
    desc: '基于 Spring Boot + Vue 3 的前后端分离学科竞赛管理平台',
    tech: ['Spring Boot', 'Vue 3', 'MySQL', 'JPA'],
    features: ['角色权限管理 (RBAC)', '安全报名机制', '竞赛全生命周期管理', '名单实时管理'],
    icon: 'trophy',
    github: 'https://github.com/tongfengguan/SchoolCompetitionWeb',
  },
  {
    title: '校园失物招领系统',
    desc: '基于 Uni-app (Vue3) + Spring Boot 的前后端分离架构小程序系统',
    tech: ['Uni-app', 'Vue 3', 'Spring Boot', 'MyBatis-Plus', 'JWT'],
    features: ['发布寻物/招领', '物品列表浏览', '申请认领', '管理端审核'],
    icon: 'found',
    github: 'https://github.com/tongfengguan/Campus-Lost-and-Found-System',
  },
]

// 实时时间
const currentTime = ref('')
const currentDate = ref('')

// ================= 核心逻辑 =================

// 1. 深色模式
const isDark = ref(false)
const toggleDark = () => {
  isDark.value = !isDark.value
}

// 2. 打字机
const displayedBio = ref('')
const timer = ref<number | null>(null)

const typeWriter = (text: string) => {
  if (timer.value) window.clearTimeout(timer.value)
  displayedBio.value = ''
  let index = 0
  const type = () => {
    if (index < text.length) {
      displayedBio.value += text.charAt(index)
      index++
      timer.value = window.setTimeout(type, 120)
    }
  }
  type()
}

const changeBio = () => {
  const filtered = bios.filter(b => b !== displayedBio.value)
  const nextBio = filtered[Math.floor(Math.random() * filtered.length)] ?? bios[0]
  typeWriter(nextBio as string)
}

// 3. Codeforces 数据获取
const cfRating = ref<number | string>('--')
const cfSolved = ref<number | string>('--')
const cfRank = ref<string>('Unrated')
const cfLoading = ref(true)

const fetchCFData = async () => {
  cfLoading.value = true
  try {
    // 获取 Rating 和 Rank
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`)
    const infoData = await infoRes.json()
    if (infoData.status === 'OK') {
      const user = infoData.result[0]
      cfRating.value = user.rating ?? 0
      cfRank.value = user.rank ?? 'Unrated'
    }

    // 获取解题数 (需过滤去重)
    const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`)
    const statusData = await statusRes.json()
    if (statusData.status === 'OK') {
      const accepted = statusData.result.filter((s: any) => s.verdict === 'OK')
      const uniqueSolved = new Set(
        accepted.map((s: any) => `${s.problem.contestId}${s.problem.index}`)
      )
      cfSolved.value = uniqueSolved.size
    }
  } catch (e) {
    console.error('CF API Error:', e)
  } finally {
    cfLoading.value = false
  }
}

const getRankColor = (rating: number | string) => {
  const r = Number(rating)
  if (isNaN(r) || r <= 0) return 'rank-gray'
  if (r < 1200) return 'rank-gray'
  if (r < 1400) return 'rank-green'
  if (r < 1600) return 'rank-cyan'
  if (r < 1900) return 'rank-blue'
  if (r < 2100) return 'rank-violet'
  if (r < 2400) return 'rank-orange'
  return 'rank-red'
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

// 鼠标跟随粒子
const mouseX = ref(0)
const mouseY = ref(0)
const particles = ref<Array<{ x: number; y: number; size: number; opacity: number }>>([])

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  
  // 添加粒子
  if (particles.value.length < 20) {
    particles.value.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    })
  } else {
    particles.value.shift()
    particles.value.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    })
  }
}

// 粒子动画
const animateParticles = () => {
  particles.value = particles.value.map((p: { x: number; y: number; size: number; opacity: number }) => ({
    ...p,
    opacity: Math.max(0, p.opacity - 0.02),
    y: p.y - 1,
  })).filter((p: { x: number; y: number; size: number; opacity: number }) => p.opacity > 0)
  requestAnimationFrame(animateParticles)
}

onMounted(() => {
  typeWriter(bios[0] as string)
  fetchCFData()
  updateTime()
  setInterval(updateTime, 1000)
  
  // 鼠标跟随
  window.addEventListener('mousemove', handleMouseMove)
  animateParticles()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <main class="container" :class="{ 'dark-theme': isDark }">
    <!-- 动态网格背景 -->
    <div class="grid-background"></div>
    
    <!-- 鼠标跟随粒子 -->
    <div class="particles-container">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          width: particle.size + 'px',
          height: particle.size + 'px',
          opacity: particle.opacity,
        }"
      ></div>
    </div>
    
    <!-- 实时时间显示 -->
    <div class="time-display">
      <div class="time-value">{{ currentTime }}</div>
      <div class="date-value">{{ currentDate }}</div>
    </div>
    
    <div class="theme-toggle" @click="toggleDark" :title="isDark ? '浅色' : '深色'">
      <svg
        v-if="isDark"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg
        v-else
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>

    <header class="profile">
      <div class="avatar-container" @click="changeBio" title="点我切换心情">
        <img src="/avatar.png" alt="Profile Avatar" class="avatar-img" />
        <div class="avatar-glow"></div>
      </div>
      <h1>TFGKK</h1>
      <div class="bio-container">
        <span class="bio-prompt">$</span>
        <p class="bio">{{ displayedBio }}<span class="cursor">|</span></p>
      </div>

      <div class="cf-stats" v-if="!cfLoading">
        <div class="cf-badge">
          <span class="label">Rating</span>
          <span :class="['value', getRankColor(cfRating)]">{{ cfRating }}</span>
        </div>
        <div class="cf-badge">
          <span class="label">Solved</span>
          <span class="value">{{ cfSolved }}</span>
        </div>
        <div class="cf-badge">
          <span class="label">Rank</span>
          <span :class="['value', getRankColor(cfRating)]">{{ cfRank }}</span>
        </div>
      </div>
      <div v-else class="cf-loading">API Loading...</div>
    </header>

    <hr class="divider" />

    <!-- 项目展示 -->
    <MyProjects :projects="myProjects" />

    <hr class="divider" />

    <!-- 项目链接 -->
    <ProjectLinks :projects="projects" />

    <footer class="footer">
      <div class="social-links">
        <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="social-link">
          <svg v-if="social.icon === 'github'" class="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <svg v-else-if="social.icon === 'email'" class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span class="social-text">{{ social.name }}</span>
        </a>
      </div>
      <p class="copyright">© 2024 TFGKK · Built with Vue 3</p>
    </footer>
  </main>
</template>

<style scoped>
/* 颜色变量定义 */
.container {
  --bg-color: #f9f7f7;
  --text-main: #112d4e;
  --text-muted: #3f72af;
  --card-bg: #ffffff;
  --card-border: #dbe2ef;
  --divider: #dbe2ef;
  --accent: #3f72af;

  min-height: 100vh;
  max-width: 100%;
  margin: 0;
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Inter', system-ui, sans-serif;
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
}

/* 动态网格背景 */
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(63, 114, 175, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(63, 114, 175, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
  animation: grid-move 20s linear infinite;
}

.container.dark-theme .grid-background {
  background-image: 
    linear-gradient(rgba(219, 226, 239, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(219, 226, 239, 0.1) 1px, transparent 1px);
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

/* 鼠标跟随粒子 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent), transparent);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.container.dark-theme .particle {
  background: radial-gradient(circle, rgba(219, 226, 239, 0.8), transparent);
  box-shadow: 0 0 10px rgba(219, 226, 239, 0.5);
}

/* 实时时间显示 */
.time-display {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.time-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.time-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.time-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(63, 114, 175, 0.3);
  animation: time-pulse 2s ease-in-out infinite;
}

@keyframes time-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.date-value {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  font-family: 'Courier New', monospace;
}

.container.dark-theme {
  --bg-color: #112d4e;
  --text-main: #dbe2ef;
  --text-muted: #3f72af;
  --card-bg: #1a3a5c;
  --card-border: #3f72af;
  --divider: #3f72af;
}

/* 主题开关 */
.theme-toggle {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.theme-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-main);
  transition: transform 0.3s ease;
}
.theme-toggle:hover .theme-icon {
  transform: rotate(-15deg);
}

/* 头部样式 */
.profile {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
}

.profile h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  background: linear-gradient(135deg, var(--accent), #112d4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.avatar-container {
  width: 140px;
  height: 140px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--card-bg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.avatar-container::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, var(--accent), #112d4e, #3f72af);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover::before {
  opacity: 1;
}

.avatar-container:hover {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 12px 32px rgba(63, 114, 175, 0.2);
}

.avatar-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  filter: blur(20px);
}

.avatar-container:hover .avatar-glow {
  opacity: 0.5;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.bio-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.bio-prompt {
  color: var(--accent);
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(63, 114, 175, 0.5);
}

.bio {
  color: var(--text-muted);
  font-size: 1.1rem;
  min-height: 1.6em;
  font-family: 'Courier New', monospace;
  margin: 0;
}
.cursor {
  color: var(--accent);
  animation: blink 1s infinite;
}

/* CF 数据条 */
.cf-stats {
  display: inline-flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--card-bg);
  border-radius: 30px;
  border: 1px solid var(--card-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.cf-stats:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.cf-badge {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
}
.cf-badge .label {
  color: var(--text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
}
.cf-badge .value {
  font-weight: bold;
}
.cf-loading {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* CF 颜色系统 */
.rank-gray {
  color: #808080;
}
.rank-green {
  color: #008000;
}
.rank-cyan {
  color: #03a89e;
}
.rank-blue {
  color: #0000ff;
}
.rank-violet {
  color: #a0a;
}
.rank-orange {
  color: #ff8c00;
}
.rank-red {
  color: #ff0000;
}

/* 分隔线 */
.divider {
  border: 0;
  height: 1px;
  background: var(--divider);
  margin: 3rem auto;
  max-width: 800px;
}

/* 分隔线样式保留在主页 */

/* 页脚 */
.footer {
  margin-top: 5rem;
  text-align: center;
  border-top: 1px solid var(--divider);
  padding-top: 2.5rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  border-radius: 12px;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  transition: all 0.3s ease;
}

.social-link:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 114, 175, 0.15);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.social-link:hover .social-icon {
  transform: scale(1.15);
}

.social-text {
  font-size: 0.95rem;
}

.copyright {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .social-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .social-link {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 2rem 1rem;
  }
  
  .profile h1 {
    font-size: 2rem;
  }
  
  .avatar-container {
    width: 120px;
    height: 120px;
  }
  
  .cf-stats {
    gap: 0.8rem;
    font-size: 0.7rem;
    padding: 0.5rem 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .theme-toggle {
    top: 1rem;
    right: 1rem;
    width: 2.25rem;
    height: 2.25rem;
  }
  
  .time-display {
    top: 1rem;
    left: 1rem;
    padding: 0.75rem 1rem;
  }
  
  .time-value {
    font-size: 1.25rem;
  }
  
  .date-value {
    font-size: 0.75rem;
  }
}
</style>
