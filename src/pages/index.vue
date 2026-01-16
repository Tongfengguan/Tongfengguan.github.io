<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    // ================= 配置区 =================
    const cfHandle = 'tfgkk' // 🔴 记得修改这里为你的 Codeforces ID

    const projects = [
      {
        title: '个人计划表',
        desc: '学习进度与长期目标管理',
        url: 'https://tongfengguan.github.io/Studyplan/',
      },
      {
        title: 'AI 面试题',
        desc: '深度学习与大模型面试题库',
        url: 'https://tongfengguan.github.io/Interview/',
      },
      {
        title: 'Codeforces',
        desc: 'Codeforces 直达',
        url: 'https://codeforces.com/',
      },
    ]

    const socials = [
      { name: 'GitHub', url: 'https://github.com/tongfengguan' },
      { name: 'Email', url: 'mailto:1316187067@qq.com' },
    ]

    const bios = [
      '算法蒟蒻梦想成为ACMer',
      'Keep Coding, Keep Improving',
      'While(true) { Study(); }',
      'XCPC暴零选手',
      '铁牌收藏家',
    ]

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

    onMounted(() => {
      typeWriter(bios[0] as string)
      fetchCFData()
    })

    return {
      projects,
      socials,
      displayedBio,
      changeBio,
      isDark,
      toggleDark,
      cfRating,
      cfSolved,
      cfRank,
      cfLoading,
      getRankColor,
    }
  },
})
</script>

<template>
  <main class="container" :class="{ 'dark-theme': isDark }">
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
      </div>
      <h1>TFGKK</h1>
      <p class="bio">{{ displayedBio }}<span class="cursor">|</span></p>

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

    <section class="section">
      <h2>🚀 一些奇奇怪怪的东西喵</h2>
      <div class="grid">
        <a v-for="item in projects" :key="item.title" :href="item.url" class="card" target="_blank">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </a>
      </div>
    </section>

    <footer class="footer">
      <div class="social-links">
        <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank">
          {{ social.name }}
        </a>
      </div>
      <p class="copyright">© 2024 TFGKK · Built with Vue 3</p>
    </footer>
  </main>
</template>

<style scoped>
/* 颜色变量定义 */
.container {
  --bg-color: #f8fafc;
  --text-main: #2d3748;
  --text-muted: #718096;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --divider: #edf2f7;
  --accent: #3b82f6;

  min-height: 100vh;
  max-width: 100%;
  margin: 0;
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Inter', system-ui, sans-serif;
  transition: all 0.3s ease;
}

.container.dark-theme {
  --bg-color: #0f172a;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --card-bg: #1e293b;
  --card-border: #334155;
  --divider: #334155;
}

/* 主题开关 */
.theme-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
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
  margin-bottom: 2rem;
}

.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--card-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}
.avatar-container:hover {
  transform: scale(1.08);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.bio {
  color: var(--text-muted);
  font-size: 1.1rem;
  min-height: 1.6em;
  font-family: 'Courier New', monospace;
}
.cursor {
  color: var(--accent);
  animation: blink 1s infinite;
}

/* CF 数据条 */
.cf-stats {
  display: inline-flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1.2rem;
  background: var(--card-bg);
  border-radius: 30px;
  border: 1px solid var(--card-border);
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

/* 卡片网格 */
.section {
  max-width: 800px;
  margin: 0 auto;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  padding: 1.5rem;
  border: 1px solid var(--card-border);
  border-radius: 12px;
  text-decoration: none;
  background: var(--card-bg);
  transition: all 0.3s ease;
}
.card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
}
.card p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* 页脚 */
.footer {
  margin-top: 5rem;
  text-align: center;
  border-top: 1px solid var(--divider);
  padding-top: 2rem;
}
.social-links a {
  margin: 0 1rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
}
.social-links a:hover {
  color: var(--accent);
}
.copyright {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 2rem 1rem;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .cf-stats {
    gap: 0.8rem;
    font-size: 0.7rem;
  }
}
</style>
