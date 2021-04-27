import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'loading',
    component: () => import('@/views/Loading.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Registration.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/Authenticated/AuthHome.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Authenticated/Profile.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/Authenticated/About.vue')
  },
  {
    path: '/interests',
    name: 'interests',
    component: () => import('@/views/Authenticated/Interests.vue')
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/views/Authenticated/Gallery.vue')
  },
  {
    path: '/upgrade',
    name: 'upgrade',
    component: () => import('@/views/Authenticated/Upgrade.vue')
  },
  {
    path: '/e-points',
    name: 'e-points',
    component: () => import('@/views/Authenticated/EPoints.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Authenticated/Settings/SettingsMenu.vue')
  },
  {
    path: '/settings/account',
    name: 'account',
    component: () => import('@/views/Authenticated/Settings/AccountSettings.vue')
  },
  {
    path: '/settings/account/update-password',
    name: 'change-password',
    component: () => import('@/views/Authenticated/Settings/ChangePassword.vue')
  },
  {
    path: '/settings/cities',
    name: 'cities',
    component: () => import('@/views/Authenticated/Settings/PreferredCities.vue')
  },
  {
    path: '/settings/notifications',
    name: 'notifications',
    component: () => import('@/views/Authenticated/Settings/Notification.vue')
  },
  {
    path: '/settings/proximity',
    name: 'proximity',
    component: () => import('@/views/Authenticated/Settings/Proximity.vue')
  },
  {
    path: '/settings/faqs',
    name: 'faqs',
    component: () => import('@/views/Authenticated/Settings/Faq.vue')
  },
  {
    path: '/settings/faq-content',
    name: 'faq-content',
    component: () => import('@/views/Authenticated/Settings/FaqContent.vue')
  },
  {
    path: '/settings/contact-us',
    name: 'contact-us',
    component: () => import('@/views/Authenticated/Settings/ContactUs.vue')
  },
  {
    path: '/posting/event-details',
    name: 'post-1',
    component: () => import('@/views/Authenticated/Posting/Post1.vue')
  },
  {
    path: '/posting/event-time-details',
    name: 'post-2',
    component: () => import('@/views/Authenticated/Posting/Post2.vue')
  },
  {
    path: '/posting/event-banner',
    name: 'post-3',
    component: () => import('@/views/Authenticated/Posting/Post3.vue')
  },
  {
    path: '/posts/:id',
    name: 'post-content',
    component: () => import('@/views/Authenticated/Posting/Content.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
