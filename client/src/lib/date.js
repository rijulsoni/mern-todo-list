export function startOfDay(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function addDays(date, amount) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export function startOfWeek(date) {
  const day = startOfDay(date)
  const daysSinceMonday = (day.getDay() + 6) % 7
  return addDays(day, -daysSinceMonday)
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

const pad = (n) => String(n).padStart(2, '0')

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromDateKey(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key ?? '')) return null

  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

export function toTimeValue(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const formatWeekday = (date) => date.toLocaleDateString('en-US', { weekday: 'short' })

export const formatDayOfMonth = (date) => pad(date.getDate())

export const formatShortDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })

export const formatDateTime = (date) =>
  date.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

export function formatLongDate(date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const year = date.getFullYear() === new Date().getFullYear() ? '' : ` ${date.getFullYear()}`
  return `${weekday} ${date.getDate()}, ${month}${year}`
}

export function formatTimeValue(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatWeekRange(start, endExclusive) {
  const end = addDays(endExclusive, -1)
  const startLabel = start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  const endLabel = end.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${startLabel} – ${endLabel}`
}
