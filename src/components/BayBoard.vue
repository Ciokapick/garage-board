<script setup lang="ts">
import { computed } from 'vue'
import { useWorkshopStore, WORKSHOP_CAPACITY } from '@/stores/workshop'
import type { WorkOrder, WorkOrderStatus } from '@/types/workshop'
import PlateBadge from './PlateBadge.vue'
import StatusBadge from './StatusBadge.vue'

// One tile per physical bay; cars fill bays in the order they arrived.
defineEmits<{ select: [order: WorkOrder] }>()
const store = useWorkshopStore()
const tone: Record<WorkOrderStatus, string> = {
  intake: '#8a867d', diagnostics: 'var(--blue)', repair: 'var(--amber)', quality: 'var(--violet)', ready: 'var(--green)',
}
const bays = computed(() => Array.from({ length: WORKSHOP_CAPACITY }, (_, i) => ({
  no: String(i + 1).padStart(2, '0'),
  order: store.activeOrders[i] ?? null,
})))
</script>

<template>
  <section class="panel bay-panel">
    <header class="panel-header">
      <div><h3>Shop floor</h3><p>Which bay holds which car right now</p></div>
      <span class="bay-legend">{{ store.activeOrders.length }} / {{ WORKSHOP_CAPACITY }} bays in use</span>
    </header>
    <div class="bay-grid">
      <template v-for="bay in bays" :key="bay.no">
        <button v-if="bay.order" class="bay" type="button" :style="{ '--bay-color': tone[bay.order.status] }" @click="$emit('select', bay.order)">
          <span class="bay-no">BAY {{ bay.no }}</span>
          <PlateBadge :plate="bay.order.vehicle.registration" />
          <strong>{{ bay.order.vehicle.make }} {{ bay.order.vehicle.model }}</strong>
          <small>{{ bay.order.technician ?? 'Unassigned' }}</small>
          <StatusBadge :status="bay.order.status" />
        </button>
        <div v-else class="bay bay--free">
          <span class="bay-no">BAY {{ bay.no }}</span>
          <strong>Free</strong>
        </div>
      </template>
    </div>
  </section>
</template>
