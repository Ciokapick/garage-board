<script setup lang="ts">
import type { WorkOrder } from '@/types/workshop'
import { formatCurrency, formatDate } from '@/utils/format'

defineProps<{ order: WorkOrder }>()
const today = new Date().toISOString()
</script>

<template>
  <Teleport to="body">
    <div class="print-sheet" aria-hidden="true">
      <header class="ps-head">
        <div>
          <h1>Northline Auto</h1>
          <p>Str. Fabricii 21, Sector 6, Bucharest · +40 21 555 01 40 · service@northline-auto.ro</p>
        </div>
        <div class="ps-order">
          <strong>Work order {{ order.id }}</strong>
          <span>Issued {{ formatDate(today, { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
        </div>
      </header>

      <section class="ps-parties">
        <div>
          <h2>Customer</h2>
          <p><strong>{{ order.customerName }}</strong></p>
          <p>{{ order.customerPhone }}</p>
        </div>
        <div>
          <h2>Vehicle</h2>
          <p><strong>{{ order.vehicle.make }} {{ order.vehicle.model }}</strong> · {{ order.vehicle.year }}</p>
          <p>Plate: {{ order.vehicle.registration }}</p>
        </div>
        <div>
          <h2>Schedule</h2>
          <p>Received: {{ formatDate(order.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
          <p>Promised: {{ formatDate(order.dueAt, { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
        </div>
      </section>

      <table class="ps-items">
        <thead>
          <tr><th>Service item</th><th>Qty</th><th>Unit price</th><th>Line total</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ order.service }}</td>
            <td>1</td>
            <td>{{ formatCurrency(order.estimate) }}</td>
            <td>{{ formatCurrency(order.estimate) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td colspan="3">Total (estimate)</td><td>{{ formatCurrency(order.estimate) }}</td></tr>
        </tfoot>
      </table>

      <section v-if="order.notes" class="ps-notes">
        <h2>Intake notes</h2>
        <p>{{ order.notes }}</p>
      </section>

      <footer class="ps-signatures">
        <div><span /><p>Client</p></div>
        <div><span /><p>Service manager</p></div>
      </footer>

      <p class="ps-legal">Estimate only — final invoice may differ after diagnosis. Prices include VAT.</p>
    </div>
  </Teleport>
</template>
