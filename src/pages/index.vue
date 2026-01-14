<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
})
</script>

<template>
  <main class="container">
    <h1>TFGKK</h1>
    <ul class="links">
      <li><a href="https://tongfengguan.github.io/Studyplan/">个人计划表</a></li>
      <li><a href="https://tongfengguan.github.io/Interview/">AI 面试题</a></li>
    </ul>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 4rem auto;
  padding: 1rem;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
.links { list-style: none; padding: 0; }
.links li { margin: 0.5rem 0; }
a { color: #3b82f6; text-decoration: none; }
</style>