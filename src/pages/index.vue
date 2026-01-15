<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    // 1. 链接数据
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
    ]

    const socials = [
      { name: 'GitHub', url: 'https://github.com/tongfengguan' },
      { name: 'Email', url: 'mailto:' },
    ]

    // 2. 打字机逻辑
    const bios = [
      '算法蒟蒻梦想成为ACMer',
      'Keep Coding, Keep Improving',
      'While(true) { Study(); }',
      'XCPC暴零选手',
      '铁牌收藏家',
    ]
    const displayedBio = ref('')
    const timer = ref<number | null>(null)

    const typeWriter = (text: string) => {
      if (timer.value) clearTimeout(timer.value)

      displayedBio.value = ''
      let index = 0

      const type = () => {
        if (index < text.length) {
          displayedBio.value += text.charAt(index)
          index++
          timer.value = window.setTimeout(type, 120) // 控制打字速度
        }
      }
      type()
    }

    const changeBio = () => {
      const filtered = bios.filter((b) => b !== displayedBio.value)
      const nextBio = filtered[Math.floor(Math.random() * filtered.length)] ?? bios[0]
      typeWriter(nextBio as string)
    }

    onMounted(() => {
      typeWriter(bios[0] as string)
    })

    return { projects, socials, displayedBio, changeBio }
  },
})
</script>

<template>
  <main class="container">
    <header class="profile">
      <div class="avatar-container" @click="changeBio" title="点我切换心情">
        <img src="../../static/avatar.png" alt="Profile Avatar" class="avatar-img" />
      </div>
      <h1>TFGKK</h1>
      <p class="bio">{{ displayedBio }}<span class="cursor">|</span></p>
    </header>

    <hr class="divider" />

    <section class="section">
      <h2>🚀 我的期末作业</h2>
      <div class="grid">
        <a v-for="item in projects" :key="item.title" :href="item.url" class="card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </a>
      </div>
    </section>

    <footer class="footer">
      <div class="social-links">
        <a v-for="social in socials" :key="social.name" :href="social.url">
          {{ social.name }}
        </a>
      </div>
      <p class="copyright">© 2024 TFGKK · Built with Vue 3</p>
    </footer>
  </main>
</template>

<style scoped>
/* 基础布局 */
.container {
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 2rem;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  color: #2d3748;
  line-height: 1.6;
}

/* 头部样式 */
.profile {
  text-align: center;
  margin-bottom: 2rem;
}

/* 头像容器：增加了鼠标手型和缩放动画 */
.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
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

/* 打字机文本样式 */
.bio {
  color: #718096;
  font-size: 1.1rem;
  min-height: 1.6em; /* 防止文字跳动 */
  font-family: 'Courier New', Courier, monospace;
}

/* 闪烁的光标 */
.cursor {
  color: #3b82f6;
  font-weight: bold;
  margin-left: 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* 分隔线 */
.divider {
  border: 0;
  height: 1px;
  background: #edf2f7;
  margin: 3rem 0;
}

/* 卡片网格 */
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
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  background: white;
}
.card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.card h3 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
}
.card p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

/* 页脚 */
.footer {
  margin-top: 5rem;
  text-align: center;
  border-top: 1px solid #edf2f7;
  padding-top: 2rem;
}
.social-links a {
  margin: 0 1rem;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
}
.social-links a:hover {
  color: #3b82f6;
}
.copyright {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: #a0aec0;
}

@media (max-width: 480px) {
  .container {
    margin: 2rem auto;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
