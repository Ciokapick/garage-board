<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mail, Search, UsersRound } from '@lucide/vue'
import { useWorkshopStore } from '@/stores/workshop'
import { formatCurrency, formatDate, initials } from '@/utils/format'
const store = useWorkshopStore()
const query = ref('')
const filtered = computed(() => store.customers.filter((item) => `${item.name} ${item.email} ${item.phone} ${item.vehicle}`.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <div class="page">
    <section class="page-intro page-intro--compact"><div><h2>Customers</h2><p>A clear service history for every relationship.</p></div></section>
    <section class="customer-summary"><div><span>Active customers</span><strong>{{ store.customers.length }}</strong><small>in this demo workspace</small></div><div><span>Returning customers</span><strong>67%</strong><small>4 of 6 customers</small></div><div><span>Lifetime value</span><strong>{{ formatCurrency(store.customers.reduce((sum, c) => sum + c.lifetimeValue, 0)) }}</strong><small>across all visits</small></div></section>
    <section class="panel customer-panel">
      <div class="toolbar"><label class="table-search"><Search :size="18" /><input v-model="query" type="search" placeholder="Search customers or vehicles" /></label></div>
      <div class="customer-grid">
        <article v-for="customer in filtered" :key="customer.id" class="customer-card">
          <header><span class="avatar avatar--large">{{ initials(customer.name) }}</span><div><h3>{{ customer.name }}</h3><p>{{ customer.vehicle }}</p></div><a :href="`mailto:${customer.email}`" aria-label="Email customer"><Mail :size="18" /></a></header>
          <div class="customer-contact"><span>{{ customer.phone }}</span><span>{{ customer.email }}</span></div>
          <footer><div><small>Visits</small><strong>{{ customer.visits }}</strong></div><div><small>Lifetime value</small><strong>{{ formatCurrency(customer.lifetimeValue) }}</strong></div><div><small>Last visit</small><strong>{{ formatDate(customer.lastVisit) }}</strong></div></footer>
        </article>
      </div>
      <div v-if="!filtered.length" class="empty-state"><UsersRound :size="28" /><h3>No customers found</h3><p>Try a different name, vehicle or contact detail.</p></div>
    </section>
  </div>
</template>
