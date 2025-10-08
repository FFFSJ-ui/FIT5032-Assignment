import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, waitInitialization } from '../auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirstView from '@/views/FirstView.vue'
import EventView from '@/views/EventView.vue'
import ApiView from '@/views/ApiView.vue'
import MapView from '@/views/MapView.vue'
import ProfileView from '@/views/ProfileView.vue'
import DashboardView from '@/views/DashboardView.vue'
import EventDetailView from '@/views/EventDetailView.vue'
import EventsLocationAPI from '@/components/EventsLocationAPI.vue'
import EventsTimeAPI from '@/components/EventsTimeAPI.vue'
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
    path: '/event',
    name: 'Event',
    component: EventView,
  },
  {
    path: '/event/:id',
    name: 'EventDetail',
    component: EventDetailView,
  },
  {
    path: '/api',
    name: 'Api',
    component: ApiView,
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
{
  path: '/eventsLocation',
  name: 'EventsLocation',
  component:EventsLocationAPI,
  meta: { hideHeader: true },
},
{
  path: '/eventsTime', 
  name: 'EventsTime',
  component: EventsTimeAPI,
  meta: { hideHeader: true },
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
