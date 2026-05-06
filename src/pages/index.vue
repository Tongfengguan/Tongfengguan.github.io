<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectSection from '../components/ProjectSection.vue'
import LinksSection from '../components/LinksSection.vue'

// ================= Data Configuration =================
const cfHandle = 'tfgkk'
const bios = ['Creative Developer / Algorithm Enthusiast', 'Building robust systems with clean code', 'Passionate about XCPC and Open Source', 'Turning complex problems into elegant solutions']

const bookmarks = ref([
  {
    category: 'Intelligence',
    links: [
      { title: 'Claude', desc: 'Anthropic AI', url: 'https://claude.ai/' },
      { title: 'Gemini', desc: 'Google AI', url: 'https://gemini.google.com/' },
      { title: 'ChatGPT', desc: 'OpenAI', url: 'https://chat.openai.com/' }
    ]
  },
  {
    category: 'Competitive',
    links: [
      { title: 'Codeforces', desc: 'Global Platform', url: 'https://codeforces.com/' },
      { title: 'AtCoder', desc: 'High Quality', url: 'https://atcoder.jp/' },
      { title: 'Nowcoder', desc: '牛客竞赛', url: 'https://ac.nowcoder.com/' }
    ]
  }
])

const myProjects = [
  {
    title: 'NingNing AI', subtitle: 'REPLICA AI ASSISTANT',
    desc: 'Advanced AI bot based on DeepSeek-V3 with RAG memory and vision capabilities.',
    tech: ['Python', 'DeepSeek-V3', 'RAG', 'FastAPI'],
    features: ['Long-term Memory', 'Semantic Search', 'Visual Recognition'],
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fdec69a?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/Tongfengguan/LingDiNingNing_talkbot'
  },
  {
    title: 'Farmer Plat', subtitle: 'SMART AGRICULTURE',
    desc: 'Full-stack platform providing policy information and management for farmers.',
    tech: ['Java 21', 'Spring Boot', 'Vue 3'],
    features: ['AI Assistant', 'Modern Architecture', 'Data Visualization'],
    image: 'https://images.unsplash.com/photo-1451187580459-434902bd0c0e?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/tongfengguan/FarmerPlatform'
  },
  {
    title: 'Comp Manager', subtitle: 'CONTEST SYSTEM',
    desc: 'Modern full-stack competition management platform with secure registration.',
    tech: ['Spring Boot 3', 'Vue 3', 'MySQL'],
    features: ['Automated Ops', 'Security First', 'Async Export'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/tongfengguan/SchoolCompetitionWeb'
  }
]

const socials = [
  { name: 'Github', url: 'https://github.com/tongfengguan' },
  { name: 'Email', url: 'mailto:1316187067@qq.com' }
]

// ================= UI Logic =================
const displayedBio = ref('')
let currentTimer: any = null
const typeWriter = (text: string) => {
  if (currentTimer) clearTimeout(currentTimer)
  let index = 0; displayedBio.value = ''
  const type = () => {
    if (index < text.length) {
      displayedBio.value += text.charAt(index)
      index++
      currentTimer = setTimeout(type, 50)
    }
  }
  type()
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

onMounted(() => {
  if (bios[0]) typeWriter(bios[0])
  fetchCFData()
})
</script>

<template>
  <main class="page">
    <header class="nav">
      <div class="nav-logo">visitor@<span>tfgkk.io</span>:~$</div>
      <div class="nav-status">
        <span class="status-dot"></span>
        <span class="mono">STATUS: ACTIVE</span>
        <span class="mono">CF: {{ cfRating }}</span>
      </div>
    </header>

    <div class="content">
      <HeroSection 
        :displayedBio="displayedBio" 
        :cfHistory="cfHistory"
      />
      
      <section class="section-label">
        <span class="mono prompt">$ ls selected_projects/</span>
      </section>

      <div class="projects-list">
        <ProjectSection 
          v-for="(project, index) in myProjects" 
          :key="index" 
          :project="project" 
          :index="index" 
        />
      </div>
      
      <section class="section-label">
        <span class="mono prompt">$ cat resources.md</span>
      </section>

      <LinksSection 
        :bookmarks="bookmarks" 
        :socials="socials" 
      />
    </div>

    <footer class="bottom-nav">
      <div class="mono">© 2026 TFGKK</div>
      <div class="social-mini">
        <a v-for="s in socials" :key="s.name" :href="s.url" class="mono">{{ s.name }}</a>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  mix-blend-mode: difference;
}

.nav-logo span {
  color: var(--accent);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #6fcf7a;
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.prompt {
  color: var(--muted);
}

.prompt::before {
  content: '';
}

.content {
  padding: 0 2rem;
}

.section-label {
  padding: 4rem 0 2rem;
  border-bottom: 1px solid #27272a;
}

.projects-list {
  display: flex;
  flex-direction: column;
}

.bottom-nav {
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #27272a;
}

.social-mini {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .nav-status { display: none; }
  .nav { padding: 1.5rem; }
  .content { padding: 0 1.5rem; }
}
</style>
