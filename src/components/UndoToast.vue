<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { X } from '@lucide/vue'
import { useWorkshopStore } from '@/stores/workshop'

const store = useWorkshopStore()
let timer: ReturnType<typeof setTimeout> | undefined

watch(() => store.toast?.id, (id) => {
  clearTimeout(timer)
  if (id) timer = setTimeout(() => store.dismissToast(), 5000)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="store.toast" class="toast" role="status">
        <span class="mono">{{ store.toast.message }}</span>
        <button class="toast-undo" @click="store.undo()">Undo</button>
        <button class="toast-close" aria-label="Dismiss" @click="store.dismissToast()"><X :size="15" /></button>
      </div>
    </Transition>
  </Teleport>
</template>
