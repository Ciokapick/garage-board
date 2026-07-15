<script setup lang="ts">
import { computed, ref } from 'vue'
import { Banknote, CalendarClock, ChevronRight, CircleCheckBig, ClipboardList, Gauge, Plus, TimerReset } from '@lucide/vue'
import { useWorkshopStore } from '@/stores/workshop'
import type { WorkOrder } from '@/types/workshop'
import { formatCurrency, formatDate, initials } from '@/utils/format'
import MetricCard from '@/components/MetricCard.vue'
import OrderDrawer from '@/components/OrderDrawer.vue'
import PlateBadge from '@/components/PlateBadge.vue'
import WorkOrderRow from '@/components/WorkOrderRow.vue'

defineEmits<{ newIntake: [] }>()
const store = useWorkshopStore()
const selected = ref<WorkOrder | null>(null)
const todayLabel = computed(() => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()))
const statusLine = computed(() => {
  const inShop = store.activeOrders.length
  const parts = [`${inShop} ${inShop === 1 ? 'car' : 'cars'} in the shop`, `${store.dueToday.length} due today`]
  if (store.completedCount) parts.push(`${store.completedCount} ready for pickup`)
  return parts.join(' — ')
})
const recentOrders = computed(() => store.orders.slice(0, 5))
const schedule = computed(() => [...store.dueToday].sort((a, b) => a.dueAt.localeCompare(b.dueAt)))
</script>

<template>
  <div class="page dashboard-page">
    <section class="page-intro">
      <div><span class="date-label">Shop floor</span><h2>{{ todayLabel }}</h2><p>{{ statusLine }}</p></div>
      <button class="button button--secondary desktop-action" @click="$emit('newIntake')"><Plus :size="18" /> Add work order</button>
    </section>

    <section class="metrics-grid">
      <MetricCard label="Cars in the shop" :value="store.activeOrders.length" :detail="`${store.dueToday.length} due today`" :icon="ClipboardList" tone="blue" />
      <MetricCard label="Pipeline value" :value="formatCurrency(store.revenuePipeline)" :detail="`across ${store.orders.length} open orders`" :icon="Banknote" tone="green" />
      <MetricCard label="Avg. ticket" :value="formatCurrency(store.averageTicket)" detail="per work order" :icon="Gauge" tone="violet" />
      <MetricCard label="Ready for pickup" :value="store.completedCount" detail="waiting on the customer" :icon="CircleCheckBig" tone="amber" />
    </section>

    <section class="dashboard-grid">
      <div class="panel orders-panel">
        <header class="panel-header"><div><h3>Workshop activity</h3><p>Live view across every service stage</p></div><RouterLink to="/work-orders" class="text-link">View all <ChevronRight :size="16" /></RouterLink></header>
        <div class="order-table-head"><span>Vehicle</span><span>Service</span><span>Status</span><span>Technician</span><span>Due / estimate</span><span /></div>
        <div class="order-list"><WorkOrderRow v-for="order in recentOrders" :key="order.id" :order="order" @select="selected = $event" /></div>
      </div>

      <aside class="panel schedule-panel">
        <header class="panel-header"><div><h3>Today’s schedule</h3><p>{{ schedule.length }} promised handovers</p></div><span class="calendar-icon"><CalendarClock :size="19" /></span></header>
        <div v-if="schedule.length" class="schedule-list">
          <button v-for="order in schedule" :key="order.id" class="schedule-item" @click="selected = order">
            <span class="schedule-time">{{ formatDate(order.dueAt, { hour: '2-digit', minute: '2-digit' }) }}</span>
            <span class="schedule-line" />
            <span class="schedule-info"><strong>{{ order.vehicle.make }} {{ order.vehicle.model }} <PlateBadge :plate="order.vehicle.registration" /></strong><small>{{ order.service }}</small><span><i class="mini-avatar">{{ initials(order.technician ?? 'NA') }}</i>{{ order.technician ?? 'Unassigned' }}</span></span>
          </button>
        </div>
        <div v-else class="empty-compact"><TimerReset :size="24" /><strong>No handovers today</strong><span>The schedule is clear.</span></div>
        <RouterLink to="/work-orders" class="schedule-footer">Open workshop board <ChevronRight :size="16" /></RouterLink>
      </aside>
    </section>

    <section class="panel capacity-panel">
      <header class="panel-header"><div><h3>Team capacity</h3><p>Assigned jobs and current utilisation</p></div><span class="capacity-note"><i /> Balanced workload</span></header>
      <div class="capacity-grid">
        <div v-for="tech in [{ name: 'Mihai', load: 78, jobs: 2 }, { name: 'Radu', load: 62, jobs: 2 }, { name: 'Alex', load: 41, jobs: 1 }]" :key="tech.name" class="capacity-row">
          <span class="avatar">{{ initials(tech.name) }}</span><div><p><strong>{{ tech.name }}</strong><span>{{ tech.jobs }} active jobs</span></p><div class="progress-track"><span :style="{ width: `${tech.load}%` }" /></div></div><strong>{{ tech.load }}%</strong>
        </div>
      </div>
    </section>
  </div>
  <OrderDrawer :order="selected" @close="selected = null" />
</template>
