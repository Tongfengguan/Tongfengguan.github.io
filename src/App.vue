<template>
  <div>
    <nav>
      <router-link to="/">首页</router-link> |
      <router-link to="/studyplan">个人计划表</router-link> |
      <router-link to="/interview">AI 面试题</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
  body { font-family: system-ui, sans-serif; }
  nav { padding: 1rem; }
</style>
