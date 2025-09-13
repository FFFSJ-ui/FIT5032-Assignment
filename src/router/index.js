import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, waitInitialization } from '../auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirstView from '@/views/FirstView.vue'
import ActiveView from '@/views/ActiveView.vue'
import AiView from '@/views/AiView.vue'
import MapView from '@/views/MapView.vue'
import ProfileView from '@/views/ProfileView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ActiveDetailView from '@/views/ActiveDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/first',
    name: 'First',
    component: FirstView,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/active',
    name: 'Active',
    component: ActiveView,
  },
  {
    path: '/active/:id',
    name: 'ActiveDetail',
    component: ActiveDetailView,
  },
  {
    path: '/ai',
    name: 'Ai',
    component: AiView,
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  await waitInitialization()
  if (to.meta && to.meta.requiresAuth) {
    const loggedIn = !!isAuthenticated.value
    if (!loggedIn) {
      return next({ path: '/first', query: { redirect: to.fullPath } })
    }
  }
  next()
})

export default router
