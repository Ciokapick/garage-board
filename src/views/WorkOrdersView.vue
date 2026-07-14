<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, LayoutList, Plus, RotateCcw, Search, SlidersHorizontal } from '@lucide/vue'
import { useWorkshopStore } from '@/stores/workshop'
import { useRoute } from 'vue-router'
import type { WorkOrder, WorkOrderStatus } from '@/types/workshop'
import OrderDrawer from '@/components/OrderDrawer.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { formatCurrency, initials, relativeDue } from '@/utils/format'

defineEmits<{ newIntake: [] }>()
const store = useWorkshopStore()
const route = useRoute()
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const status = ref<'all' | WorkOrderStatus>('all')
const urgentOnly = ref(false)
const selected = ref<WorkOrder | null>(null)
const statuses: Array<{ value: 'all' | WorkOrderStatus; label: string }> = [
  { value: 'all', label: 'All' }, { value: 'intake', label: 'Intake' }, { value: 'diagnostics', label: 'Diagnostics' },
  { value: 'repair', label: 'In repair' }, { value: 'quality', label: 'Quality' }, { value: 'ready', label: 'Ready' },
]
const filtered = computed(() => store.orders.filter((order) => {
  const haystack = `${order.id} ${order.customerName} ${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.registration} ${order.service}`.toLowerCase()
  return (status.value === 'all' || order.status === status.value) && (!urgentOnly.value || order.priority === 'urgent') && haystack.includes(query.value.toLowerCase())
}))
const countFor = (value: 'all' | WorkOrderStatus) => value === 'all' ? store.orders.length : store.orders.filter((order) => order.status === value).length
</script>

<template>
  <div class="page">
    <section class="page-intro page-intro--compact"><div><h2>Work orders</h2><p>Track every vehicle from check-in to collection.</p></div><button class="button button--primary" @click="$emit('newIntake')"><Plus :size="18" /> New intake</button></section>
    <section class="panel work-orders-panel">
      <div class="toolbar">
        <label class="table-search"><Search :size="18" /><input v-model="query" type="search" placeholder="Search vehicle, customer or plate" /></label>
        <div class="toolbar-actions"><button class="button button--secondary" :class="{ 'filter-active': urgentOnly }" @click="urgentOnly = !urgentOnly"><SlidersHorizontal :size="17" /> {{ urgentOnly ? 'Urgent only' : 'Priority' }}</button><button class="icon-button" title="Reset demo data" aria-label="Reset demo data" @click="store.resetDemo"><RotateCcw :size="18" /></button></div>
      </div>
      <div class="filter-tabs" role="tablist" aria-label="Filter by status"><button v-for="item in statuses" :key="item.value" :class="{ active: status === item.value }" @click="status = item.value">{{ item.label }} <span>{{ countFor(item.value) }}</span></button></div>
      <div class="work-orders-head"><span>Work order</span><span>Customer</span><span>Status</span><span>Technician</span><span>Progress</span><span>Due</span><span /></div>
      <div v-if="filtered.length" class="work-orders-list">
        <button v-for="order in filtered" :key="order.id" class="work-order-line" @click="selected = order">
          <span class="wo-vehicle"><i>{{ order.vehicle.make.slice(0, 1) }}</i><span><strong>{{ order.vehicle.make }} {{ order.vehicle.model }}</strong><small>{{ order.id }} · {{ order.vehicle.registration }}</small></span></span>
          <span class="wo-customer"><strong>{{ order.customerName }}</strong><small>{{ order.service }}</small></span>
          <StatusBadge :status="order.status" />
          <span class="order-technician"><i v-if="order.technician" class="mini-avatar">{{ initials(order.technician) }}</i>{{ order.technician ?? 'Unassigned' }}</span>
          <span class="wo-progress"><span><i :style="{ width: `${order.progress}%` }" /></span><small>{{ order.progress }}%</small></span>
          <span class="wo-due" :class="{ urgent: order.priority === 'urgent' }"><strong>{{ relativeDue(order.dueAt) }}</strong><small>{{ formatCurrency(order.estimate) }}</small></span>
          <ChevronRight :size="17" />
        </button>
      </div>
      <div v-else class="empty-state"><LayoutList :size="28" /><h3>No matching work orders</h3><p>Try another search or status filter.</p><button class="button button--secondary" @click="query = ''; status = 'all'; urgentOnly = false">Clear filters</button></div>
    </section>
  </div>
  <OrderDrawer :order="selected" @close="selected = null" />
</template>
