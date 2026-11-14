import { useCallback, useEffect, useState } from 'react'
import { tasksApi } from '../api/tasks.js'

export function useTasks(params, { refreshKey } = {}) {
  const query = params ? new URLSearchParams(params).toString() : null

  const [result, setResult] = useState({ query: null, tasks: [], error: null })
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (query === null) return
    const controller = new AbortController()

    tasksApi
      .list(query, { signal: controller.signal })
      .then((tasks) => setResult({ query, tasks, error: null }))
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ query, tasks: [], error })
      })

    return () => controller.abort()
  }, [query, reloadCount, refreshKey])

  const setTasks = useCallback((update) => {
    setResult((prev) => ({ ...prev, tasks: typeof update === 'function' ? update(prev.tasks) : update }))
  }, [])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  const isCurrent = query !== null && result.query === query
  return {
    tasks: isCurrent ? result.tasks : [],
    error: isCurrent ? result.error : null,
    loading: query !== null && !isCurrent,
    setTasks,
    reload,
  }
}
