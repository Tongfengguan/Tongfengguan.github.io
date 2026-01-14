import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Studyplan from '../pages/Studyplan.vue'
import Interview from '../pages/Interview.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/studyplan', component: Studyplan },
    { path: '/interview', component: Interview }
  ]
})
