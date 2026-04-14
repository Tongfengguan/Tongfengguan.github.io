<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, CSSProperties } from 'vue'
import MyProjects from '../components/MyProjects.vue'
import ProjectLinks from '../components/ProjectLinks.vue'

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

const displayedBio = ref('')
const typeWriter = (text: string) => {
  let index = 0; displayedBio.value = ''
  const type = () => {
    if (index < text.length) { displayedBio.value += text.charAt(index); index++; setTimeout(type, 100) }
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
    if (info.status === 'OK') { cfRating.value = info.result[0].rating || 0; cfRank.value = info.result[0].rank || 'Unrated' }
    if (status.status === 'OK') { cfSolved.value = new Set(status.result.filter((s: any) => s.verdict === 'OK').map((s: any) => `${s.problem.contestId}${s.problem.index}`)).size.toString() }
  } catch (e) { console.error(e) } finally { cfLoading.value = false }
}

const getRankColor = (rating: any) => {
  const r = Number(rating); if (isNaN(r)) return 'rank-gray'
  if (r < 1200) return 'rank-gray'; if (r < 1400) return 'rank-green'; if (r < 1600) return 'rank-cyan'
  if (r < 1900) return 'rank-blue'; if (r < 2100) return 'rank-violet'; if (r < 2400) return 'rank-orange'
  return 'rank-red'
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

const avatarStyle = computed((): CSSProperties => {
  const active = currentIndex.value > 0
  const scale = active ? 0.4 : 1.0
  const currentX = active ? 60 : window.innerWidth / 2
  const currentY = active ? 60 : window.innerHeight * 0.4
  return {
    position: 'fixed', left: '0', top: '0',
    transform: `translate3d(${Math.round(currentX)}px, ${Math.round(currentY)}px, 0) scale(${scale}) translate(-50%, -50%)`,
    transition: 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
    zIndex: 1000, willChange: 'transform'
  }
})

onMounted(() => {
  if (bios[0]) typeWriter(bios[0]); fetchCFData()
  window.addEventListener('wheel', handleWheel, { passive: false })
})
onUnmounted(() => { window.removeEventListener('wheel', handleWheel) })
</script>

<template>
  <main class="page-viewport" :class="{ 'dark-theme': isDark }">
    <div class="bg-system"><div class="grid-dot"></div><div class="glow g1"></div><div class="glow g2"></div></div>
    
    <div class="theme-btn" @click="toggleDark">
      <div class="btn-inner" :class="{ 'is-dark': isDark }">
        <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </div>
    </div>

    <div class="avatar-fixed-box" :style="avatarStyle">
      <div class="avatar-ring" @click="changeBio"><img src="/avatar.png" alt="Avatar" /><div class="ring-glow"></div></div>
    </div>

    <div class="page-wrapper" :style="{ transform: `translate3d(0, -${currentIndex * 100}vh, 0)` }">
      
      <!-- 第一屏：Hero View -->
      <section class="page-section hero-view">
        <div class="hero-text" :class="{ 'visible': currentIndex === 0 }">
          <h1 class="name">TFGKK</h1>
          <div class="typing-box"><span class="symbol">></span><span class="text">{{ displayedBio }}</span><span class="cursor">_</span></div>
          <div class="cf-stats-row" v-if="!cfLoading">
            <div class="stat-item"><span class="val" :class="getRankColor(cfRating)">{{ cfRating }}</span><span class="lab">Rating</span></div>
            <div class="stat-item"><span class="val">{{ cfSolved }}</span><span class="lab">Solved</span></div>
            <div class="stat-item"><span class="val" :class="getRankColor(cfRating)">{{ cfRank }}</span><span class="lab">Rank</span></div>
          </div>
        </div>
        <div class="scroll-hint" @click="goToSection(1)"><div class="mouse-icon"></div><span>Scroll Down</span></div>
      </section>

      <!-- 项目屏 -->
      <section v-for="(project, index) in myProjects" :key="index" class="page-section project-view">
        <div class="project-board" :class="{ 'board-visible': currentIndex === index + 1 }">
          <div class="board-header">
            <div class="board-index">0{{ index + 1 }}</div>
            <div class="board-title-group"><h2 class="board-title">{{ project.title }}</h2><span class="board-subtitle">{{ project.subtitle }}</span></div>
          </div>
          <div class="board-body">
            <div class="board-left">
              <p class="board-desc">{{ project.desc }}</p>
              <div class="tech-stack"><div v-for="t in project.tech" :key="t" class="tech-chip"><span class="chip-dot"></span>{{ t }}</div></div>
            </div>
            <div class="board-right">
              <div class="features-label">Key Features</div>
              <ul class="features-list">
                <li v-for="f in project.features" :key="f"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>{{ f }}</li>
              </ul>
            </div>
          </div>
          <div class="board-footer">
            <a :href="project.github" target="_blank" class="github-action"><span>Source Code</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
          </div>
        </div>
      </section>

      <!-- 链接屏 -->
      <section class="page-section links-view">
        <div class="links-content-wrapper" :class="{ 'visible': currentIndex === totalSections - 1 }">
          <ProjectLinks :projects="projects" />
          <footer class="footer">
            <div class="socials"><a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" class="social-tag">{{ s.name }}</a></div>
            <p class="copy">© 2024 TFGKK · Digital Portfolio</p>
          </footer>
        </div>
      </section>
    </div>

    <div class="side-nav">
      <div v-for="i in totalSections" :key="i" class="nav-dot" :class="{ 'active': currentIndex === i-1 }" @click="goToSection(i-1)"></div>
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

.page-wrapper { height: 100vh; width: 100%; transition: transform 0.85s cubic-bezier(0.645, 0.045, 0.355, 1); }
.page-section { height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }

/* 修复 Hero View 的居中问题 */
.hero-view { padding: 0; flex-direction: column; }
.hero-text { 
  width: 100%;
  text-align: center; 
  opacity: 0; 
  transform: translateY(30px); 
  transition: all 0.8s 0.3s; 
  margin-top: 180px; /* 关键：为屏幕 40% 处的中心大头像留出空间，使其完美位于下方 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg-system { position: fixed; inset: 0; z-index: 0; }
.grid-dot { position: absolute; inset: 0; background-image: radial-gradient(var(--text-mute) 0.5px, transparent 0.5px); background-size: 30px 30px; opacity: 0.12; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.25; }
.g1 { width: 45vw; height: 45vw; background: var(--accent); top: -10%; right: -5%; }
.g2 { width: 55vw; height: 55vw; background: #6366f1; bottom: -15%; left: -10%; }

.theme-btn { position: fixed; top: 25px; right: 25px; z-index: 1100; width: 46px; height: 46px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); }
.btn-inner svg { width: 22px; height: 22px; color: var(--accent); }

.avatar-ring { width: 140px; height: 140px; border-radius: 50%; border: 4px solid var(--glass-bg); overflow: hidden; position: relative; box-shadow: 0 12px 30px rgba(0,0,0,0.15); cursor: pointer; pointer-events: auto; }
.avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
.ring-glow { position: absolute; inset: -10px; background: var(--accent); filter: blur(20px); opacity: 0; transition: 0.3s; }
.avatar-ring:hover .ring-glow { opacity: 0.35; }

.hero-text.visible { opacity: 1; transform: translateY(0); }
.name { font-size: 5.5rem; font-weight: 900; background: linear-gradient(to bottom right, var(--text-main), var(--accent)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -2px; }
.typing-box { font-family: monospace; font-size: 1.5rem; color: var(--text-mute); margin: 25px 0; min-height: 1.5em; }
.cf-stats-row { display: flex; gap: 35px; margin-top: 35px; padding: 18px 35px; background: var(--glass-bg); border-radius: 24px; backdrop-filter: blur(15px); border: 1px solid var(--glass-border); }
.stat-item .val { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }
.stat-item .lab { font-size: 0.8rem; text-transform: uppercase; color: var(--text-mute); font-weight: 600; }

.project-view { padding: 0 40px; }
.project-board { width: 100%; max-width: 1000px; background: var(--glass-bg); border-radius: 36px; border: 1px solid var(--glass-border); backdrop-filter: blur(25px); padding: 55px; display: flex; flex-direction: column; gap: 40px; box-shadow: 0 40px 80px rgba(0,0,0,0.12); opacity: 0; transform: scale(0.92) translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.board-visible { opacity: 1; transform: scale(1) translateY(0); }
.board-index { font-size: 3.5rem; font-weight: 900; color: var(--accent); opacity: 0.2; font-family: monospace; line-height: 1; }
.board-title { font-size: 2.6rem; font-weight: 800; margin: 0; color: var(--text-main); }
.board-subtitle { font-size: 1rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.features-label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-mute); letter-spacing: 2px; margin-bottom: 15px; font-weight: 700; }
.board-body { display: grid; grid-template-columns: 1.2fr 1fr; gap: 50px; }
.board-desc { font-size: 1.25rem; line-height: 1.7; color: var(--text-main); }
.tech-chip { display: flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(37, 99, 235, 0.08); border: 1px solid var(--accent); border-radius: 100px; font-size: 0.9rem; font-weight: 700; color: var(--accent); }
.features-list li { display: flex; align-items: center; gap: 14px; color: var(--text-main); font-size: 1.05rem; }
.features-list li svg { width: 20px; height: 20px; color: var(--accent); flex-shrink: 0; }
.github-action { display: inline-flex; align-items: center; gap: 12px; padding: 14px 30px; background: var(--text-main); color: var(--bg); text-decoration: none; border-radius: 16px; font-weight: 700; transition: 0.3s; }

.links-view { padding: 0 40px; }
.links-content-wrapper { width: 100%; max-width: 1100px; opacity: 0; transition: 0.8s 0.3s; }
.links-content-wrapper.visible { opacity: 1; }
.footer { margin-top: 60px; text-align: center; }
.socials { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; }
.social-tag { padding: 8px 18px; background: var(--glass-bg); border-radius: 10px; text-decoration: none; color: var(--text-main); border: 1px solid var(--glass-border); transition: 0.3s; }
.social-tag:hover { border-color: var(--accent); transform: translateY(-3px); }

.side-nav { position: fixed; right: 35px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 18px; z-index: 100; }
.nav-dot { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid var(--accent); cursor: pointer; transition: 0.4s; opacity: 0.5; }
.nav-dot.active { height: 35px; border-radius: 6px; background: var(--accent); opacity: 1; }

.scroll-hint { position: absolute; bottom: 45px; display: flex; flex-direction: column; align-items: center; color: var(--text-mute); cursor: pointer; }
.mouse-icon { width: 24px; height: 40px; border: 2.5px solid var(--text-mute); border-radius: 12px; position: relative; margin-bottom: 10px; }
.mouse-icon::after { content:''; width:5px; height:5px; background:var(--accent); position:absolute; left:50%; margin-left:-2.5px; top:8px; border-radius:50%; animation: m-scroll 2s infinite; }

/* Codeforces 官方标准色方案 */
.rank-gray { color: #808080; } 
.rank-green { color: #008000; } 
.rank-cyan { color: #03a89e; }
.rank-blue { color: #0000ff; } 
.rank-violet { color: #a0a; } 
.rank-orange { color: #ff8c00; }
.rank-red { color: #ff0000; }

.dark-theme .rank-blue { color: #4a90e2; }
.dark-theme .rank-violet { color: #c084fc; }
.dark-theme .rank-cyan { color: #22d3ee; }

@media (max-width: 900px) { .board-body { grid-template-columns: 1fr; gap: 30px; } .name { font-size: 3.5rem; } .avatar-fixed-box { display: none; } .project-board { padding: 35px; } .hero-text { margin-top: 120px; } }
@keyframes m-scroll { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(18px); opacity: 0; } }
</style>
