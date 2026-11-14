import { useState } from 'react'
import { tasksApi } from '../api/tasks.js'
import TaskItem from './TaskItem.jsx'
import TaskSheet from './TaskSheet.jsx'

const byStartTime = (a, b) => new Date(a.startsAt) - new Date(b.startsAt)

export default function TaskList({
  tasks,
  setTasks,
  emptyMessage,
  showActions = true,
  showDate = false,
  onTaskSaved,
}) {
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)

  async function toggleStatus(task) {
    const status = task.status === 'completed' ? 'in_progress' : 'completed'
    setError(null)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)))

    try {
      await tasksApi.update(task.id, { status })
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
      setError(`Couldn't update "${task.title}". ${err.message}`)
    }
  }

  async function deleteTask(task) {
    setError(null)
    setTasks((prev) => prev.filter((t) => t.id !== task.id))

    try {
      await tasksApi.remove(task.id)
    } catch (err) {
      setTasks((prev) => [...prev, task].sort(byStartTime))
      setError(`Couldn't delete "${task.title}". ${err.message}`)
    }
  }

  function handleSaved(saved) {
    setEditing(null)
    setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)).sort(byStartTime))
    onTaskSaved?.(saved)
  }

  function handleDeleted(deleted) {
    setEditing(null)
    setTasks((prev) => prev.filter((t) => t.id !== deleted.id))
  }

  return (
    <>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      {tasks.length === 0 ? (
        <p className="py-6 text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showActions={showActions}
              showDate={showDate}
              onToggle={() => toggleStatus(task)}
              onDelete={() => deleteTask(task)}
              onOpen={() => setEditing(task)}
            />
          ))}
        </ul>
      )}

      {editing && (
        <TaskSheet
          task={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </>
  )
}
