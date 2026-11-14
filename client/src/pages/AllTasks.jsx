import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { tasksApi } from '../api/tasks.js'
import PageHeader from '../components/PageHeader.jsx'
import TaskList from '../components/TaskList.jsx'
import { useTasks } from '../hooks/useTasks.js'
import { formatWeekRange } from '../lib/date.js'

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function AllTasks() {
  const [now] = useState(() => new Date())
  const [weeks, setWeeks] = useState(null)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    tasksApi
      .weeklySummary(timeZone, { signal: controller.signal })
      .then(setWeeks)
      .catch((err) => {
        if (!controller.signal.aborted) setError(err)
      })

    return () => controller.abort()
  }, [version])

  const refresh = () => setVersion((v) => v + 1)

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-page px-6 pt-[31px] pb-10 md:max-w-2xl lg:max-w-3xl lg:pt-10">
      <PageHeader title="All Tasks" />

      <div className="mt-6 flex flex-col gap-4">
        {error && <p className="text-sm text-red-600">Couldn&apos;t load your tasks. {error.message}</p>}
        {!error && !weeks && <p className="text-sm text-muted">Loading…</p>}
        {weeks?.length === 0 && <p className="text-sm text-muted">No tasks yet. Add one from the home screen.</p>}
        {weeks?.map((week) => (
          <WeekCard key={week.start} week={week} now={now} refreshKey={version} onTaskSaved={refresh} />
        ))}
      </div>
    </main>
  )
}

function WeekCard({ week, now, refreshKey, onTaskSaved }) {
  const start = new Date(week.start)
  const end = new Date(week.end)
  const isCurrentWeek = start <= now && now < end

  const [expanded, setExpanded] = useState(isCurrentWeek)
  const [opened, setOpened] = useState(isCurrentWeek)
  const { tasks, setTasks, loading, error, reload } = useTasks(
    opened ? { from: week.start, to: week.end } : null,
    { refreshKey },
  )

  const counted = opened && !loading && !error
  const completed = counted ? tasks.filter((t) => t.status === 'completed').length : week.completed
  const open = counted ? tasks.length - completed : week.open

  return (
    <section className="border border-line bg-white">
      <button
        type="button"
        onClick={() => {
          setExpanded((value) => !value)
          setOpened(true)
        }}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {formatWeekRange(start, end)}
            {isCurrentWeek && <span className="ml-2 text-xs font-normal text-primary">This week</span>}
          </p>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="bg-[#ffe6e6] px-2 py-1 text-[#c62121]">{open} open</span>
            <span className="bg-[#eef1ff] px-2 py-1 text-[#1f2b75]">{completed} completed</span>
          </div>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 text-subtle transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="px-4 pb-2">
          {loading && <p className="py-4 text-sm text-muted">Loading…</p>}
          {error && (
            <p className="py-4 text-sm text-red-600">
              {error.message}{' '}
              <button type="button" onClick={reload} className="font-medium underline">
                Try again
              </button>
            </p>
          )}
          {!loading && !error && (
            <TaskList
              tasks={tasks}
              setTasks={setTasks}
              showDate
              emptyMessage="No tasks left this week."
              onTaskSaved={onTaskSaved}
            />
          )}
        </div>
      )}
    </section>
  )
}
