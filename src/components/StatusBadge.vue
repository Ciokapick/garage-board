<script setup lang="ts">
import { computed } from 'vue'
import type { WorkOrderStatus } from '@/types/workshop'

const props = defineProps<{ status: WorkOrderStatus }>()
const labels: Record<WorkOrderStatus, string> = {
  intake: 'Intake', diagnostics: 'Diagnostics', repair: 'In repair', quality: 'Quality check', ready: 'Ready',
}
const label = computed(() => labels[props.status])
</script>

<template><span class="status-badge" :class="`status-badge--${status}`"><i />{{ label }}</span></template>
