import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '@/views/Login.vue';

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '*',
    component: () => import('@/views/NOT_FOUND.vue'),
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
