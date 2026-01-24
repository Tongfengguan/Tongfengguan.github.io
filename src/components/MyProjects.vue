<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Project {
  title: string
  desc: string
  tech: string[]
  features: string[]
  icon: string
  github?: string
}

export default defineComponent({
  name: 'MyProjects',
  props: {
    projects: {
      type: Array as PropType<Project[]>,
      required: true,
    },
  },
})
</script>

<template>
  <section class="section tech-section">
    <h2 class="section-title">
      <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
      <span>我的项目</span>
    </h2>
    <div class="project-grid">
      <div v-for="project in projects" :key="project.title" class="project-card">
        <div class="project-header">
          <div class="project-icon-wrapper">
            <!-- 奖杯图标 -->
            <svg v-if="project.icon === 'trophy'" class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
            <!-- 失物招领图标 -->
            <svg v-else-if="project.icon === 'found'" class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3 class="project-title">{{ project.title }}</h3>
        </div>
        <p class="project-desc">{{ project.desc }}</p>
        <div class="project-tech">
          <span v-for="t in project.tech" :key="t" class="tech-tag">{{ t }}</span>
        </div>
        <div class="project-features">
          <div v-for="(feature, idx) in project.features" :key="idx" class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{{ feature }}</span>
          </div>
        </div>
        <a v-if="project.github" :href="project.github" target="_blank" class="project-link">
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>查看源码</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.tech-section {
  margin: 3rem auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: var(--text-main);
  font-weight: 600;
}

.section-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--accent);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.project-grid {
  display: grid;
  gap: 2rem;
  margin-top: 1.5rem;
}

.project-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--accent), #112d4e);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.project-card:hover::before {
  transform: scaleY(1);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--accent);
}

.project-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), #112d4e);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.project-desc {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  padding: 0.4rem 0.8rem;
  background: var(--divider);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-main);
  font-family: 'Courier New', monospace;
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
}

.project-card:hover .tech-tag {
  background: var(--card-bg);
  border-color: var(--accent);
  color: var(--accent);
}

.project-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.feature-icon {
  width: 1rem;
  height: 1rem;
  color: var(--accent);
  flex-shrink: 0;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--accent);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.project-link:hover {
  background: #112d4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 114, 175, 0.4);
}

.github-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .section-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .project-grid {
    gap: 1.5rem;
  }
  
  .project-card {
    padding: 1.5rem;
  }
  
  .project-title {
    font-size: 1.25rem;
  }
}
</style>
