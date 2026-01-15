<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    // 将链接数据化，方便以后维护
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
      { name: 'Email', url: 'mailto:your-email@example.com' },
    ]

    return { projects, socials }
  },
})
</script>

<template>
  <main class="container">
    <header class="profile">
      <div class="avatar-container">
        <img src="./assets/avatar.png" alt="Profile Avatar" class="avatar-img" />
      </div>
      <h1>TFGKK</h1>
      <p class="bio">专注 AI 算法与前端开发</p>
    </header>

    <hr class="divider" />

    <section class="section">
      <h2>🚀 我的项目</h2>
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
.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

/* 头像容器：控制大小和形状 */
.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 图片样式：填充容器 */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：保持比例裁剪，防止图片拉伸变形 */
  display: block;
}
.bio {
  color: #718096;
  font-size: 1.1rem;
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

/* 移动端适配 */
@media (max-width: 480px) {
  .container {
    margin: 2rem auto;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
