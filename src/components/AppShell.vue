<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkshopStore } from '@/stores/workshop'
import {
  Bell, ChartNoAxesCombined, ChevronLeft, CircleUserRound, ClipboardList,
  LayoutDashboard, Menu, Plus, Search, UsersRound, Wrench, X,
} from '@lucide/vue'

const emit = defineEmits<{ newIntake: [] }>()

const route = useRoute()
const store = useWorkshopStore()
const router = useRouter()
const mobileNavOpen = ref(false)
const globalQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const notificationsOpen = ref(false)
const nav = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Work orders', to: '/work-orders', icon: ClipboardList },
  { label: 'Customers', to: '/customers', icon: UsersRound },
  { label: 'Reports', to: '/reports', icon: ChartNoAxesCombined },
]
const pageTitle = computed(() => String(route.meta.title ?? 'Overview'))

function search() {
  const query = globalQuery.value.trim()
  if (query) router.push({ path: '/work-orders', query: { q: query } })
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement
    && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
}

function onShortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
    return
  }
  // ponytail: DOM check for an open layer beats plumbing modal state up the tree
  if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey && !event.altKey
    && !isTyping(event.target) && !document.querySelector('.drawer-layer, .modal-layer')) {
    event.preventDefault()
    emit('newIntake')
  }
}

onMounted(() => window.addEventListener('keydown', onShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', onShortcut))
</script>

<template>
  <div class="app-shell">
    <div v-if="mobileNavOpen" class="nav-scrim" @click="mobileNavOpen = false" />
    <aside class="sidebar" :class="{ 'is-open': mobileNavOpen }">
      <div class="brand">
        <span class="brand-mark"><Wrench :size="19" stroke-width="2.4" /></span>
        <span>Garage<span>Board</span></span>
        <button class="icon-button mobile-only" aria-label="Close navigation" @click="mobileNavOpen = false"><X :size="20" /></button>
      </div>

      <nav aria-label="Primary navigation">
        <p class="nav-label">Workspace</p>
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-item" @click="mobileNavOpen = false">
          <component :is="item.icon" :size="19" />
          <span>{{ item.label }}</span>
          <span v-if="item.to === '/work-orders'" class="nav-count">{{ store.activeOrders.length }}</span>
        </RouterLink>
      </nav>

      <div class="shop-card">
        <div class="shop-card__icon"><Wrench :size="18" /></div>
        <div><strong>Northline Auto</strong><span>Workshop · Bucharest</span></div>
        <ChevronLeft :size="17" class="shop-card__chevron" />
      </div>
      <div class="sidebar-user">
        <div class="avatar avatar--photo">DP</div>
        <div><strong>Denis Paval</strong><span>Service manager</span></div>
        <CircleUserRound :size="18" />
      </div>
      <div class="shortcut-hints" aria-label="Keyboard shortcuts">
        <span><kbd>⌘K</kbd> search</span>
        <span><kbd>N</kbd> new intake</span>
        <span><kbd>Esc</kbd> close</span>
      </div>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div class="topbar__title">
          <button class="icon-button menu-button" aria-label="Open navigation" @click="mobileNavOpen = true"><Menu :size="21" /></button>
          <div><p>Northline Auto</p><h1>{{ pageTitle }}</h1></div>
        </div>
        <div class="topbar__actions">
          <form class="global-search" role="search" @submit.prevent="search">
            <Search :size="18" />
            <input ref="searchInput" v-model="globalQuery" type="search" placeholder="Search orders, plates…" aria-label="Search all work orders" />
            <kbd>⌘ K</kbd>
          </form>
          <div class="notification-wrap">
            <button class="icon-button notification-button" aria-label="Notifications" :aria-expanded="notificationsOpen" @click="notificationsOpen = !notificationsOpen"><Bell :size="19" /><span /></button>
            <div v-if="notificationsOpen" class="notification-popover">
              <header><strong>Notifications</strong><button @click="notificationsOpen = false">Close</button></header>
              <div><i class="notification-dot notification-dot--amber" /><p><strong>GB-1048 is due today</strong><span>Timing belt work is 62% complete.</span></p></div>
              <div><i class="notification-dot notification-dot--green" /><p><strong>GB-1044 is ready</strong><span>Ioana Pavel can be notified for collection.</span></p></div>
            </div>
          </div>
          <button class="button button--primary" @click="$emit('newIntake')"><Plus :size="18" /> New intake</button>
        </div>
      </header>
      <main class="content"><slot /></main>
    </div>
  </div>
</template>
