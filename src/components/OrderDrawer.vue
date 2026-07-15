<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, ArrowRight, CalendarDays, CarFront, Phone, Printer, UserRound, Wrench, X } from '@lucide/vue'
import { useWorkshopStore } from '@/stores/workshop'
import type { WorkOrder } from '@/types/workshop'
import { formatCurrency, formatDate, relativeDue } from '@/utils/format'
import PlateBadge from './PlateBadge.vue'
import PrintSheet from './PrintSheet.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{ order: WorkOrder | null }>()
defineEmits<{ close: [] }>()
const store = useWorkshopStore()
const canBack = computed(() => props.order?.status !== 'intake')
const canForward = computed(() => props.order?.status !== 'ready')

function printSheet() {
  window.print()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="order" class="drawer-layer" @mousedown.self="$emit('close')">
        <aside class="order-drawer" role="dialog" aria-modal="true" :aria-label="`Work order ${order.id}`">
          <header class="drawer-header">
            <div><span class="eyebrow">Work order</span><h2>{{ order.id }}</h2></div>
            <button class="icon-button" aria-label="Close details" @click="$emit('close')"><X :size="20" /></button>
          </header>
          <div class="drawer-body">
            <div class="drawer-status"><StatusBadge :status="order.status" /><span :class="{ urgent: order.priority === 'urgent' }">{{ relativeDue(order.dueAt) }}</span></div>
            <section class="vehicle-hero">
              <span><CarFront :size="27" /></span>
              <div><p>{{ order.vehicle.year }} <PlateBadge class="plate--large" :plate="order.vehicle.registration" /></p><h3>{{ order.vehicle.make }} {{ order.vehicle.model }}</h3></div>
            </section>
            <section class="detail-section">
              <h4>Service</h4>
              <div class="detail-line"><Wrench :size="18" /><div><strong>{{ order.service }}</strong><span>Estimated at {{ formatCurrency(order.estimate) }}</span></div></div>
              <p class="notes">{{ order.notes || 'No intake notes added.' }}</p>
            </section>
            <section class="detail-section">
              <h4>Customer & schedule</h4>
              <div class="detail-line"><UserRound :size="18" /><div><strong>{{ order.customerName }}</strong><span>{{ order.customerPhone }}</span></div><a :href="`tel:${order.customerPhone}`" aria-label="Call customer"><Phone :size="17" /></a></div>
              <div class="detail-line"><CalendarDays :size="18" /><div><strong>{{ formatDate(order.dueAt, { weekday: 'long', day: 'numeric', month: 'long' }) }}</strong><span>Promised completion</span></div></div>
            </section>
            <section class="detail-section">
              <div class="section-heading"><h4>Assigned technician</h4></div>
              <select :value="order.technician ?? ''" @change="store.assignTechnician(order.id, ($event.target as HTMLSelectElement).value || null)">
                <option value="">Unassigned</option><option>Mihai</option><option>Radu</option><option>Alex</option>
              </select>
            </section>
            <section class="detail-section progress-section">
              <div class="section-heading"><h4>Progress</h4><strong>{{ order.progress }}%</strong></div>
              <div class="progress-track"><span :style="{ width: `${order.progress}%` }" /></div>
            </section>
          </div>
          <footer class="drawer-footer">
            <button class="button button--ghost print-button" @click="printSheet"><Printer :size="17" /> Print work order</button>
            <button class="button button--secondary" :disabled="!canBack" @click="store.moveOrder(order.id, 'back')"><ArrowLeft :size="17" /> Move back</button>
            <button class="button button--primary" :disabled="!canForward" @click="store.moveOrder(order.id, 'forward')">Advance stage <ArrowRight :size="17" /></button>
          </footer>
        </aside>
        <PrintSheet :order="order" />
      </div>
    </Transition>
  </Teleport>
</template>
