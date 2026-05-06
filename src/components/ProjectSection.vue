<script lang="ts" setup>
interface Project {
  title: string
  subtitle: string
  desc: string
  tech: string[]
  github: string
}

interface Props {
  project: Project
  index: number
}

defineProps<Props>()
</script>

<template>
  <div class="project-item">
    <a :href="project.github" target="_blank" class="project-link">
      <div class="project-meta">
        <span class="mono">0{{ index + 1 }} / {{ project.subtitle }}</span>
      </div>
      <div class="project-content">
        <h2 class="project-title">{{ project.title }}</h2>
        <div class="project-details">
          <p class="project-desc">{{ project.desc }}</p>
          <div class="project-tech">
            <span v-for="t in project.tech" :key="t" class="mono tech-tag">{{ t }}</span>
          </div>
        </div>
      </div>
      <div class="project-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </div>
    </a>
  </div>
</template>

<style scoped>
.project-item {
  border-bottom: 1px solid #27272a;
}

.project-link {
  display: grid;
  grid-template-columns: 150px 1fr 100px;
  padding: 4rem 0;
  transition: var(--ease);
}

.project-link:hover {
  background-color: #0f0f11;
  padding-left: 2rem;
  padding-right: 2rem;
}

.project-meta {
  padding-top: 0.5rem;
}

.project-title {
  font-size: clamp(2rem, 6vw, 5rem);
  margin-bottom: 1.5rem;
  transition: transform 0.5s var(--ease);
}

.project-link:hover .project-title {
  transform: translateX(10px);
}

.project-details {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

.project-desc {
  max-width: 40ch;
  color: var(--muted);
  font-size: 1.1rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tech-tag {
  color: var(--muted);
  border: 1px solid #27272a;
  padding: 0.2rem 0.6rem;
}

.project-arrow {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  opacity: 0.2;
  transition: var(--ease);
}

.project-link:hover .project-arrow {
  opacity: 1;
  transform: scale(1.2);
}

.project-arrow svg {
  width: 40px;
  height: 40px;
}

@media (max-width: 1024px) {
  .project-link {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 0;
  }
  .project-details {
    flex-direction: column;
    gap: 2rem;
  }
  .project-arrow { display: none; }
}
</style>
