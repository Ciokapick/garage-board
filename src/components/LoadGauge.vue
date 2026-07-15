<script setup lang="ts">
import { computed } from 'vue'
import { useWorkshopStore, WORKSHOP_CAPACITY } from '@/stores/workshop'

// Hand-built SVG tachometer: 240° sweep, ticks per bay, redline near capacity.
const store = useWorkshopStore()
const CX = 100
const CY = 108
const R = 82
const SWEEP = 240

const point = (f: number, r: number) => {
  const a = (Math.PI / 180) * (210 - SWEEP * f)
  return { x: +(CX + r * Math.cos(a)).toFixed(2), y: +(CY - r * Math.sin(a)).toFixed(2) }
}
const arc = (from: number, to: number, r: number) => {
  const p1 = point(from, r)
  const p2 = point(to, r)
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${to - from > 0.5 ? 1 : 0} 1 ${p2.x} ${p2.y}`
}

const redlineFrom = (WORKSHOP_CAPACITY - 2) / WORKSHOP_CAPACITY
const ticks = Array.from({ length: WORKSHOP_CAPACITY + 1 }, (_, i) => {
  const f = i / WORKSHOP_CAPACITY
  return { value: i, redline: f >= redlineFrom, outer: point(f, R), inner: point(f, R - 9), label: point(f, R - 20) }
})

const clamped = computed(() => Math.min(store.workshopLoad, 1))
const needleAngle = computed(() => -120 + SWEEP * clamped.value)
const inShop = computed(() => store.activeOrders.length)
</script>

<template>
  <svg
    class="gauge" viewBox="0 0 200 150" role="img"
    :aria-label="`Workshop load: ${inShop} of ${WORKSHOP_CAPACITY} bays in use`"
  >
    <path class="gauge-track" :d="arc(0, 1, R)" />
    <path class="gauge-redline" :d="arc(redlineFrom, 1, R)" />
    <path v-if="clamped" class="gauge-progress" :d="arc(0, clamped, R)" />
    <g v-for="tick in ticks" :key="tick.value">
      <line
        :class="tick.redline ? 'gauge-tick gauge-tick--red' : 'gauge-tick'"
        :x1="tick.outer.x" :y1="tick.outer.y" :x2="tick.inner.x" :y2="tick.inner.y"
      />
      <text class="gauge-num" :x="tick.label.x" :y="tick.label.y">{{ tick.value }}</text>
    </g>
    <g class="gauge-needle" :style="{ transform: `rotate(${needleAngle}deg)` }">
      <polygon points="97,108 100,42 103,108" />
    </g>
    <circle class="gauge-hub" :cx="CX" :cy="CY" r="7" />
    <text class="gauge-value" :x="CX" :y="CY + 26">{{ inShop }} / {{ WORKSHOP_CAPACITY }}</text>
    <text class="gauge-caption" :x="CX" :y="CY + 38">bays in use</text>
  </svg>
</template>
