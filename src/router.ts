import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
