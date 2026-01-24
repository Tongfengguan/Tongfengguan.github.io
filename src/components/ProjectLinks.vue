<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface ProjectLink {
  title: string
  desc: string
  url: string
  icon: string
}

export default defineComponent({
  name: 'ProjectLinks',
  props: {
    projects: {
      type: Array as PropType<ProjectLink[]>,
      required: true,
    },
  },
})
</script>

<template>
  <section class="section">
    <h2 class="section-title">
      <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
      <span>一些奇奇怪怪的东西喵</span>
    </h2>
    <div class="grid">
      <a v-for="item in projects" :key="item.title" :href="item.url" class="card" target="_blank">
        <div class="card-icon-wrapper">
          <!-- 日历图标 -->
          <svg v-if="item.icon === 'calendar'" class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <!-- Codeforces 图标 -->
          <svg v-else-if="item.icon === 'codeforces'" class="card-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  position: relative;
  padding: 2rem;
  border: 1px solid var(--card-border);
  border-radius: 16px;
  text-decoration: none;
  background: var(--card-bg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), #112d4e, var(--accent));
  background-size: 200% 100%;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.card:hover::before {
  transform: scaleX(1);
  animation: gradient-shift 2s linear infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-6px) rotateX(2deg) rotateY(-2deg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), #112d4e);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.card:hover .card-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 20px rgba(63, 114, 175, 0.3);
}

.card-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: white;
  transition: transform 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card-content {
  flex: 1;
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
  font-size: 1.25rem;
  font-weight: 600;
}

.card p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
  transition: all 0.3s ease;
  align-self: flex-end;
  margin-top: auto;
}

.card:hover .card-arrow {
  color: var(--accent);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .section-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 1.5rem;
  }
}
</style>
