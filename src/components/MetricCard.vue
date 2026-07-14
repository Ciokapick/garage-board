<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowDownRight, ArrowUpRight } from '@lucide/vue'

defineProps<{ label: string; value: string | number; detail: string; trend?: 'up' | 'down'; icon: Component; tone?: string }>()
</script>

<template>
  <article class="metric-card">
    <div class="metric-card__head"><span class="metric-icon" :class="tone"><component :is="icon" :size="19" /></span><span class="metric-label">{{ label }}</span></div>
    <strong class="metric-value">{{ value }}</strong>
    <p :class="{ 'trend-up': trend === 'up', 'trend-down': trend === 'down' }">
      <ArrowUpRight v-if="trend === 'up'" :size="14" />
      <ArrowDownRight v-if="trend === 'down'" :size="14" />
      {{ detail }}
    </p>
  </article>
</template>
