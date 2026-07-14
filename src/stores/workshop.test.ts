import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWorkshopStore } from './workshop'

describe('workshop store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('derives workshop metrics from the work orders', () => {
    const store = useWorkshopStore()

    expect(store.orders).toHaveLength(6)
    expect(store.activeOrders).toHaveLength(5)
    expect(store.revenuePipeline).toBe(2305)
    expect(store.averageTicket).toBe(384)
    expect(store.completedCount).toBe(1)
  })

  it('creates a validated intake in the first pipeline stage', () => {
    const store = useWorkshopStore()
    const id = store.addWorkOrder({
      customerName: 'Maria Stoica', customerPhone: '+40 722 000 111', make: 'Skoda', model: 'Octavia',
      year: 2020, registration: 'b 123 xyz', service: 'Oil and filter service', notes: 'Call before extra work.',
      priority: 'urgent', dueAt: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    })

    expect(id).toBe('GB-1049')
    expect(store.orders[0]).toMatchObject({ id, status: 'intake', progress: 5, priority: 'urgent' })
    expect(store.orders[0].vehicle.registration).toBe('B 123 XYZ')
  })

  it('advances work and assigns a technician', () => {
    const store = useWorkshopStore()
    const order = store.orders.find((item) => item.id === 'GB-1047')!

    store.moveOrder(order.id, 'forward')
    store.assignTechnician(order.id, 'Alex')

    expect(order.status).toBe('repair')
    expect(order.progress).toBe(58)
    expect(order.technician).toBe('Alex')
  })

  it('does not move beyond the end of the pipeline', () => {
    const store = useWorkshopStore()
    const ready = store.orders.find((item) => item.status === 'ready')!

    store.moveOrder(ready.id, 'forward')

    expect(ready.status).toBe('ready')
    expect(ready.progress).toBe(100)
  })
})
