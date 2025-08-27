import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirstView from '@/views/FirstView.vue'
import ActiveView from '@/views/ActiveView.vue'
import AiView from '@/views/AiView.vue'
import MapView from '@/views/MapView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  {
    path: '/',
    redirect: '/first'
  },
  {
    path: '/first',
    name: 'First',
    component: FirstView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/active',
    name: 'Active',
    component: ActiveView
  },
  {
    path: '/ai',
    name: 'Ai',
    component: AiView
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router