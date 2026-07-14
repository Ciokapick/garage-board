import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Customer, NewWorkOrder, WorkOrder, WorkOrderStatus } from '@/types/workshop'

const STORAGE_KEY = 'garageboard:work-orders:v1'
const statusOrder: WorkOrderStatus[] = ['intake', 'diagnostics', 'repair', 'quality', 'ready']

const dateFromNow = (days: number, hour = 17) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

export const makeSeedOrders = (): WorkOrder[] => [
  {
    id: 'GB-1048', customerId: 'c-1', customerName: 'Elena Popescu', customerPhone: '+40 744 201 889',
    vehicle: { make: 'Volkswagen', model: 'Golf VII', year: 2018, registration: 'B 482 LMX' },
    service: 'Timing belt kit & water pump', notes: 'Customer reported a light squeal on cold start.', status: 'repair',
    priority: 'urgent', technician: 'Mihai', estimate: 680, progress: 62, dueAt: dateFromNow(0, 16), createdAt: dateFromNow(-2, 9),
  },
  {
    id: 'GB-1047', customerId: 'c-2', customerName: 'Andrei Ionescu', customerPhone: '+40 723 916 440',
    vehicle: { make: 'BMW', model: '320d', year: 2019, registration: 'IF 19 ANI' },
    service: 'Brake inspection & front pads', notes: 'Vibration under braking above 80 km/h.', status: 'diagnostics',
    priority: 'standard', technician: 'Radu', estimate: 390, progress: 28, dueAt: dateFromNow(1, 14), createdAt: dateFromNow(-1, 11),
  },
  {
    id: 'GB-1046', customerId: 'c-3', customerName: 'Sofia Marinescu', customerPhone: '+40 752 118 029',
    vehicle: { make: 'Toyota', model: 'RAV4 Hybrid', year: 2021, registration: 'B 908 SFM' },
    service: 'Annual service & hybrid check', notes: 'Routine service. Keep replaced filters for customer.', status: 'quality',
    priority: 'standard', technician: 'Mihai', estimate: 320, progress: 88, dueAt: dateFromNow(0, 18), createdAt: dateFromNow(-3, 8),
  },
  {
    id: 'GB-1045', customerId: 'c-4', customerName: 'Victor Dumitru', customerPhone: '+40 728 331 502',
    vehicle: { make: 'Audi', model: 'A4 Avant', year: 2017, registration: 'B 117 VDR' },
    service: 'Air conditioning diagnosis', notes: 'Cooling becomes weak after 20 minutes.', status: 'intake',
    priority: 'standard', technician: null, estimate: 180, progress: 8, dueAt: dateFromNow(2, 17), createdAt: dateFromNow(0, 8),
  },
  {
    id: 'GB-1044', customerId: 'c-5', customerName: 'Ioana Pavel', customerPhone: '+40 733 840 117',
    vehicle: { make: 'Volvo', model: 'XC60', year: 2020, registration: 'BV 60 IOP' },
    service: 'Oil service & wheel alignment', notes: 'Pulls slightly to the right.', status: 'ready',
    priority: 'standard', technician: 'Radu', estimate: 285, progress: 100, dueAt: dateFromNow(0, 15), createdAt: dateFromNow(-2, 10),
  },
  {
    id: 'GB-1043', customerId: 'c-6', customerName: 'Matei Enache', customerPhone: '+40 746 292 006',
    vehicle: { make: 'Dacia', model: 'Duster', year: 2022, registration: 'PH 22 MTE' },
    service: 'Suspension noise diagnosis', notes: 'Knock from front-left over small bumps.', status: 'repair',
    priority: 'standard', technician: 'Alex', estimate: 450, progress: 54, dueAt: dateFromNow(1, 17), createdAt: dateFromNow(-2, 13),
  },
]

const seedCustomers: Customer[] = [
  { id: 'c-1', name: 'Elena Popescu', phone: '+40 744 201 889', email: 'elena.popescu@example.com', visits: 6, lifetimeValue: 2840, lastVisit: dateFromNow(-44), vehicle: 'Volkswagen Golf VII' },
  { id: 'c-2', name: 'Andrei Ionescu', phone: '+40 723 916 440', email: 'andrei.i@example.com', visits: 3, lifetimeValue: 1260, lastVisit: dateFromNow(-92), vehicle: 'BMW 320d' },
  { id: 'c-3', name: 'Sofia Marinescu', phone: '+40 752 118 029', email: 'sofia.m@example.com', visits: 4, lifetimeValue: 1735, lastVisit: dateFromNow(-183), vehicle: 'Toyota RAV4 Hybrid' },
  { id: 'c-4', name: 'Victor Dumitru', phone: '+40 728 331 502', email: 'victor.d@example.com', visits: 2, lifetimeValue: 640, lastVisit: dateFromNow(-71), vehicle: 'Audi A4 Avant' },
  { id: 'c-5', name: 'Ioana Pavel', phone: '+40 733 840 117', email: 'ioana.pavel@example.com', visits: 8, lifetimeValue: 4160, lastVisit: dateFromNow(-35), vehicle: 'Volvo XC60' },
  { id: 'c-6', name: 'Matei Enache', phone: '+40 746 292 006', email: 'matei.e@example.com', visits: 3, lifetimeValue: 1180, lastVisit: dateFromNow(-120), vehicle: 'Dacia Duster' },
]

function readOrders() {
  if (typeof localStorage === 'undefined') return makeSeedOrders()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as WorkOrder[] : makeSeedOrders()
  } catch {
    return makeSeedOrders()
  }
}

export const useWorkshopStore = defineStore('workshop', () => {
  const orders = ref<WorkOrder[]>(readOrders())
  const customers = ref<Customer[]>(seedCustomers)

  const activeOrders = computed(() => orders.value.filter((order) => order.status !== 'ready'))
  const dueToday = computed(() => {
    const today = new Date().toDateString()
    return orders.value.filter((order) => new Date(order.dueAt).toDateString() === today)
  })
  const revenuePipeline = computed(() => orders.value.reduce((sum, order) => sum + order.estimate, 0))
  const averageTicket = computed(() => Math.round(revenuePipeline.value / Math.max(orders.value.length, 1)))
  const completedCount = computed(() => orders.value.filter((order) => order.status === 'ready').length)

  function addWorkOrder(payload: NewWorkOrder) {
    const highestId = orders.value.reduce((max, item) => Math.max(max, Number(item.id.replace('GB-', ''))), 1048)
    const id = `GB-${highestId + 1}`
    orders.value.unshift({
      id,
      customerId: `c-${Date.now()}`,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      vehicle: { make: payload.make, model: payload.model, year: payload.year, registration: payload.registration.toUpperCase() },
      service: payload.service,
      notes: payload.notes,
      status: 'intake',
      priority: payload.priority,
      technician: null,
      estimate: 0,
      progress: 5,
      dueAt: new Date(`${payload.dueAt}T17:00:00`).toISOString(),
      createdAt: new Date().toISOString(),
    })
    return id
  }

  function moveOrder(id: string, direction: 'forward' | 'back') {
    const order = orders.value.find((item) => item.id === id)
    if (!order) return
    const current = statusOrder.indexOf(order.status)
    const next = direction === 'forward' ? Math.min(current + 1, statusOrder.length - 1) : Math.max(current - 1, 0)
    order.status = statusOrder[next]
    order.progress = [5, 25, 58, 86, 100][next]
  }

  function assignTechnician(id: string, technician: string | null) {
    const order = orders.value.find((item) => item.id === id)
    if (order) order.technician = technician
  }

  function resetDemo() {
    orders.value = makeSeedOrders()
  }

  watch(orders, (value) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  return { orders, customers, activeOrders, dueToday, revenuePipeline, averageTicket, completedCount, addWorkOrder, moveOrder, assignTechnician, resetDemo }
})
