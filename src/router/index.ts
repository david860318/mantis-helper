import { createRouter, createWebHistory } from 'vue-router'

import NotificationView from '../views/NotificationView.vue'
import StatisticsView from '../views/StatisticsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/notification',
    },
    {
      path: '/notification',
      name: 'notification',
      component: NotificationView,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
    },
  ],
})

export default router