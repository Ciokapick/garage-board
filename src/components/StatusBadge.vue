<script setup lang="ts">
import { computed } from 'vue'
import { statusLabels } from '@/stores/workshop'
import type { WorkOrderStatus } from '@/types/workshop'

const props = defineProps<{ status: WorkOrderStatus }>()
const label = computed(() => statusLabels[props.status])
</script>

<template><span class="status-badge" :class="`status-badge--${status}`"><i />{{ label }}</span></template>
