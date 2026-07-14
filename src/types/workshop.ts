export type WorkOrderStatus = 'intake' | 'diagnostics' | 'repair' | 'quality' | 'ready'
export type Priority = 'standard' | 'urgent'

export interface Vehicle {
  make: string
  model: string
  year: number
  registration: string
}

export interface WorkOrder {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  vehicle: Vehicle
  service: string
  notes: string
  status: WorkOrderStatus
  priority: Priority
  technician: string | null
  estimate: number
  progress: number
  dueAt: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  visits: number
  lifetimeValue: number
  lastVisit: string
  vehicle: string
}

export interface NewWorkOrder {
  customerName: string
  customerPhone: string
  make: string
  model: string
  year: number
  registration: string
  service: string
  notes: string
  priority: Priority
  dueAt: string
}
