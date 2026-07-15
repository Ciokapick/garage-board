<script setup lang="ts">
defineProps<{ plate: string }>()
</script>

<template>
  <span class="plate" :aria-label="`License plate ${plate}`"><i aria-hidden="true">RO</i><b>{{ plate }}</b></span>
</template>
