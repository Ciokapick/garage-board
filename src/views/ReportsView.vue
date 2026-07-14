<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Download, Euro, Timer, Wrench } from '@lucide/vue'
import { formatCurrency } from '@/utils/format'
const maxBar = 5200
const months = [{ label: 'Feb', value: 3100 }, { label: 'Mar', value: 3750 }, { label: 'Apr', value: 3420 }, { label: 'May', value: 4480 }, { label: 'Jun', value: 4210 }, { label: 'Jul', value: 4960 }]
const serviceMix = computed(() => [
  { label: 'Maintenance', value: 42, color: '#4f7cff' }, { label: 'Mechanical repair', value: 31, color: '#37b47e' },
  { label: 'Diagnostics', value: 17, color: '#9c78ee' }, { label: 'Other', value: 10, color: '#f5a743' },
])

function exportCsv() {
  const rows = [
    ['Technician', 'Jobs', 'Revenue EUR', 'Average turnaround', 'Quality pass'],
    ['Mihai', '10', '2110', '2.1 days', '98%'],
    ['Radu', '8', '1690', '2.5 days', '96%'],
    ['Alex', '6', '1160', '2.8 days', '97%'],
  ]
  const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'garageboard-technician-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="page">
    <section class="page-intro page-intro--compact"><div><h2>Reports</h2><p>A concise view of workshop performance.</p></div><button class="button button--secondary" @click="exportCsv"><Download :size="17" /> Export CSV</button></section>
    <div class="report-kpis"><article><span><Euro :size="18" /></span><div><small>Revenue this month</small><strong>€4,960</strong><p><ArrowUpRight :size="14" /> 8.4% month over month</p></div></article><article><span><Wrench :size="18" /></span><div><small>Jobs completed</small><strong>24</strong><p>4.8 jobs per week</p></div></article><article><span><Timer :size="18" /></span><div><small>Avg. turnaround</small><strong>2.4 days</strong><p>0.3 days faster</p></div></article></div>
    <section class="reports-grid">
      <article class="panel revenue-chart"><header class="panel-header"><div><h3>Revenue trend</h3><p>Closed work orders · last 6 months</p></div><strong>{{ formatCurrency(months.reduce((sum, m) => sum + m.value, 0)) }} <small>total</small></strong></header><div class="bar-chart"><div v-for="month in months" :key="month.label" class="bar-column"><span class="bar-value">{{ formatCurrency(month.value) }}</span><i :style="{ height: `${(month.value / maxBar) * 100}%` }" /><small>{{ month.label }}</small></div></div></article>
      <article class="panel service-mix"><header class="panel-header"><div><h3>Service mix</h3><p>By invoiced value</p></div></header><div class="donut-wrap"><div class="donut"><span><strong>24</strong><small>jobs</small></span></div><ul><li v-for="item in serviceMix" :key="item.label"><i :style="{ background: item.color }" /><span>{{ item.label }}</span><strong>{{ item.value }}%</strong></li></ul></div></article>
    </section>
    <section class="panel report-table"><header class="panel-header"><div><h3>Technician performance</h3><p>Current month</p></div></header><div class="tech-report-head"><span>Technician</span><span>Jobs</span><span>Revenue</span><span>Avg. time</span><span>Quality pass</span></div><div v-for="tech in [{ name: 'Mihai', jobs: 10, revenue: 2110, time: '2.1 days', quality: '98%' }, { name: 'Radu', jobs: 8, revenue: 1690, time: '2.5 days', quality: '96%' }, { name: 'Alex', jobs: 6, revenue: 1160, time: '2.8 days', quality: '97%' }]" :key="tech.name" class="tech-report-row"><strong>{{ tech.name }}</strong><span>{{ tech.jobs }}</span><span>{{ formatCurrency(tech.revenue) }}</span><span>{{ tech.time }}</span><span>{{ tech.quality }}</span></div></section>
    <p class="demo-note">Report figures are realistic demonstration data stored in the client. No external accounting system is connected.</p>
  </div>
</template>
