import { Check, SquarePen, Trash2 } from 'lucide-react'
import { formatDateTime } from '../lib/date.js'
import SwipeToDelete from './SwipeToDelete.jsx'

export default function TaskItem({ task, showActions, showDate, onToggle, onDelete, onOpen }) {
  const done = task.status === 'completed'

  return (
    <li>
      <SwipeToDelete onDelete={onDelete}>
        <div className="flex items-center gap-3">
          <label className="relative grid size-5 shrink-0 cursor-pointer place-items-center">
            <input
              type="checkbox"
              checked={done}
              onChange={onToggle}
              aria-label={`Mark "${task.title}" as ${done ? 'in progress' : 'completed'}`}
              className="peer size-5 cursor-pointer appearance-none border border-primary bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
            <Check
              className="pointer-events-none absolute size-3.5 text-primary opacity-0 peer-checked:opacity-100"
              strokeWidth={2}
              aria-hidden="true"
            />
          </label>

          <div className="flex min-h-16 min-w-0 flex-1 items-center gap-3.5 border-b border-line py-3">
            <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
              <span className={`block truncate text-sm font-medium text-ink ${done ? 'line-through' : ''}`}>
                {task.title}
              </span>
              {showDate && (
                <span className="mt-0.5 block text-xs text-muted">{formatDateTime(new Date(task.startsAt))}</span>
              )}
            </button>

            {showActions && (
              <>
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label={`Delete "${task.title}"`}
                  className="text-subtle hover:text-red-500"
                >
                  <Trash2 className="size-[22px]" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={onOpen}
                  aria-label={`Edit "${task.title}"`}
                  className="text-subtle hover:text-primary"
                >
                  <SquarePen className="size-[22px]" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </div>
      </SwipeToDelete>
    </li>
  )
}
