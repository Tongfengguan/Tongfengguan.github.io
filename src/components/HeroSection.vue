<script lang="ts" setup>
interface Props {
  displayedBio: string
  cfHistory: number[]
}

defineProps<Props>()
</script>

<template>
  <section class="hero">
    <div class="hero-main">
      <h1 class="hero-title">
        TFGKK
      </h1>
      <div class="hero-bio">
        <p class="bio-text">{{ displayedBio }}</p>
      </div>
    </div>
    
    <div class="hero-footer">
      <div class="location">
        <span class="mono">LOCATION</span>
        <span class="location-val">CHENGDU, CN</span>
      </div>
      <div class="scroll-indicator">
        <span class="mono">SCROLL TO EXPLORE</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-title {
  font-size: clamp(5rem, 20vw, 15rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.06em;
  color: var(--fg);
}

.hero-bio {
  max-width: 40ch;
}

.bio-text {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--muted);
  line-height: 1.2;
}

.hero-footer {
  position: absolute;
  bottom: 2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.location {
  display: flex;
  flex-direction: column;
}

.location-val {
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero-title { font-size: 5rem; }
  .bio-text { font-size: 1.1rem; }
}
</style>
