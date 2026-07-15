<script setup lang="ts">
import { computed } from 'vue'
import type { WorkOrderStatus } from '@/types/workshop'

const props = defineProps<{ status: WorkOrderStatus }>()
const labels: Record<WorkOrderStatus, string> = {
  intake: 'Checked in', diagnostics: 'In diagnosis', repair: 'In repair', quality: 'Final check', ready: 'Ready for pickup',
}
const label = computed(() => labels[props.status])
</script>

<template><span class="status-badge" :class="`status-badge--${status}`"><i />{{ label }}</span></template>
