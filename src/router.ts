import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const history = import.meta.env.VITE_HASH_ROUTING === 'true'
  ? createWebHashHistory(import.meta.env.BASE_URL)
  : createWebHistory(import.meta.env.BASE_URL)

export const router = createRouter({
  history,
  routes: [
    { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: 'Overview' } },
    { path: '/work-orders', name: 'work-orders', component: () => import('@/views/WorkOrdersView.vue'), meta: { title: 'Work orders' } },
    { path: '/customers', name: 'customers', component: () => import('@/views/CustomersView.vue'), meta: { title: 'Customers' } },
    { path: '/reports', name: 'reports', component: () => import('@/views/ReportsView.vue'), meta: { title: 'Reports' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title)} — GarageBoard`
})
