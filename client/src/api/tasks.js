const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data?.details)
  }
  return data
}

export const tasksApi = {
  list: (query = '', options) => request(`/tasks?${query}`, options),
  weeklySummary: (timeZone, options) =>
    request(`/tasks/weekly-summary?tz=${encodeURIComponent(timeZone)}`, options),
  get: (id, options) => request(`/tasks/${id}`, options),
  create: (task) => request('/tasks', { method: 'POST', body: task }),
  update: (id, changes) => request(`/tasks/${id}`, { method: 'PATCH', body: changes }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
}
