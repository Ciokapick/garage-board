<script setup lang="ts">
import { MoreHorizontal } from '@lucide/vue'
import type { WorkOrder } from '@/types/workshop'
import { formatCurrency, initials, relativeDue } from '@/utils/format'
import PlateBadge from './PlateBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps<{ order: WorkOrder }>()
defineEmits<{ select: [order: WorkOrder] }>()
</script>

<template>
  <button class="order-row" type="button" @click="$emit('select', order)">
    <span class="order-cell order-vehicle">
      <span class="vehicle-avatar">{{ order.vehicle.make.slice(0, 1) }}</span>
      <span><strong>{{ order.vehicle.make }} {{ order.vehicle.model }}</strong><small>{{ order.vehicle.year }} <PlateBadge :plate="order.vehicle.registration" /></small></span>
    </span>
    <span class="order-cell order-service"><strong>{{ order.service }}</strong><small>{{ order.id }}</small></span>
    <span class="order-cell"><StatusBadge :status="order.status" /></span>
    <span class="order-cell order-technician">
      <span v-if="order.technician" class="mini-avatar">{{ initials(order.technician) }}</span>
      <span>{{ order.technician ?? 'Unassigned' }}</span>
    </span>
    <span class="order-cell order-due" :class="{ urgent: order.priority === 'urgent' }"><strong>{{ relativeDue(order.dueAt) }}</strong><small>{{ formatCurrency(order.estimate) }}</small></span>
    <span class="order-cell row-more"><MoreHorizontal :size="19" /></span>
  </button>
</template>
