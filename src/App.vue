<script setup lang="ts">
import { ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import IntakeModal from '@/components/IntakeModal.vue'

const intakeOpen = ref(false)
</script>

<template>
  <AppShell @new-intake="intakeOpen = true">
    <RouterView @new-intake="intakeOpen = true" />
  </AppShell>
  <IntakeModal :open="intakeOpen" @close="intakeOpen = false" />
</template>
