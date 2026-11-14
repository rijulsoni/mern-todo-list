import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DayStrip from '../components/DayStrip.jsx'
import { SearchLink } from '../components/SearchBar.jsx'
import StatCard from '../components/StatCard.jsx'
import TaskList from '../components/TaskList.jsx'
import TaskSheet from '../components/TaskSheet.jsx'
import { useTasks } from '../hooks/useTasks.js'
import {
  addDays,
  formatShortDate,
  fromDateKey,
  isSameDay,
  startOfDay,
  startOfWeek,
  toDateKey,
} from '../lib/date.js'

export default function Home() {
  const [today] = useState(() => startOfDay(new Date()))
  const [searchParams, setSearchParams] = useSearchParams()
  const [isAdding, setIsAdding] = useState(false)

  const selectedDate = fromDateKey(searchParams.get('date')) ?? today
  const weekStart = startOfWeek(selectedDate)

  const week = useTasks({
    from: weekStart.toISOString(),
    to: addDays(weekStart, 7).toISOString(),
  })

  const completedCount = week.tasks.filter((task) => task.status === 'completed').length
  const pendingCount = week.tasks.length - completedCount
  const progress = week.tasks.length ? (completedCount / week.tasks.length) * 100 : 0

  const dayTasks = week.tasks.filter((task) => isSameDay(new Date(task.startsAt), selectedDate))
  const daysWithTasks = new Set(week.tasks.map((task) => toDateKey(new Date(task.startsAt))))

  const selectDate = (date) => setSearchParams({ date: toDateKey(date) }, { replace: true })

  function handleCreated(task) {
    setIsAdding(false)
    selectDate(new Date(task.startsAt))
    week.reload()
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-page px-6 pt-9 pb-32 md:max-w-2xl lg:max-w-6xl lg:px-10 lg:pt-10 lg:pb-12">
      <div className="flex items-center gap-6">
        <div className="min-w-0 flex-1 lg:max-w-md">
          <SearchLink />
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="ml-auto hidden h-[46px] shrink-0 items-center gap-2 bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:flex"
        >
          <Plus className="size-5" strokeWidth={1.75} aria-hidden="true" />
          Add Task
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 lg:mt-8">
        <WeekButton label="Previous week" icon={ChevronLeft} onClick={() => selectDate(addDays(selectedDate, -7))} />
        <div className="min-w-0 flex-1">
          <DayStrip today={today} selected={selectedDate} onSelect={selectDate} markedDays={daysWithTasks} />
        </div>
        <WeekButton label="Next week" icon={ChevronRight} onClick={() => selectDate(addDays(selectedDate, 7))} />
      </div>

      {week.error && (
        <p className="mt-6 text-sm text-red-600">
          Couldn&apos;t load tasks. {week.error.message}{' '}
          <button type="button" onClick={week.reload} className="font-medium underline">
            Try again
          </button>
        </p>
      )}

      <div className="lg:mt-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-10">
          <div className="mt-7.5 grid grid-cols-2 gap-4 lg:mt-0">
            <StatCard variant="complete" count={completedCount} />
            <StatCard variant="pending" count={pendingCount} />
          </div>

          <h2 className="mt-7.5 text-lg leading-7 font-semibold">Weekly Progress</h2>
          <div
            role="progressbar"
            aria-label="Tasks completed this week"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="mt-3.5 h-6 bg-track"
          >
            <div className="h-full bg-navy transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="lg:border lg:border-line lg:bg-white lg:px-6 lg:pt-5 lg:pb-3">
          <div className="mt-7.5 flex items-center justify-between lg:mt-0">
            <h2 className="text-lg leading-7 font-semibold">
              {isSameDay(selectedDate, today) ? 'Tasks Today' : `Tasks on ${formatShortDate(selectedDate)}`}
            </h2>
            <Link to="/tasks" className="text-sm text-primary">
              View All
            </Link>
          </div>

          <div className="mt-1">
            {week.loading ? (
              <p className="py-6 text-sm text-muted">Loading tasks…</p>
            ) : (
              <TaskList
                tasks={dayTasks}
                setTasks={week.setTasks}
                onTaskSaved={week.reload}
                emptyMessage="Nothing planned for this day. Tap + to add a task."
              />
            )}
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={() => setIsAdding(true)}
        aria-label="Add task"
        className="fixed bottom-7 left-1/2 grid size-[76px] -translate-x-1/2 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:hidden"
      >
        <Plus className="size-8" strokeWidth={1.5} />
      </button>

      {isAdding && (
        <TaskSheet defaultDate={selectedDate} onClose={() => setIsAdding(false)} onSaved={handleCreated} />
      )}
    </main>
  )
}

function WeekButton({ label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="hidden size-9 shrink-0 place-items-center border border-line bg-white text-ink transition-colors hover:border-primary hover:text-primary lg:grid"
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}
