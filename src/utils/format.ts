export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', options ?? { day: '2-digit', month: 'short' }).format(new Date(value))

export const relativeDue = (value: string) => {
  const target = new Date(value)
  const today = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000)
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days < 0) return `${Math.abs(days)}d overdue`
  return `Due in ${days}d`
}

export const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
