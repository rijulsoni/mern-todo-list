import { useEffect, useMemo, useRef } from 'react'
import {
  addDays,
  formatDayOfMonth,
  formatWeekday,
  fromDateKey,
  isSameDay,
  startOfWeek,
  toDateKey,
} from '../lib/date.js'

const WEEKS_BEFORE = 4
const WEEKS_AFTER = 8

export default function DayStrip({ today, selected, onSelect, markedDays }) {
  const scrollerRef = useRef(null)
  const hasScrolled = useRef(false)
  const selectedKey = toDateKey(selected)
  const selectedWeekKey = toDateKey(startOfWeek(selected))
  const thisWeekKey = toDateKey(startOfWeek(today))

  const days = useMemo(() => {
    const thisWeek = fromDateKey(thisWeekKey)
    const selectedWeek = fromDateKey(selectedWeekKey)
    const first = addDays(Math.min(thisWeek, selectedWeek), -7 * WEEKS_BEFORE)
    const last = addDays(Math.max(thisWeek, selectedWeek), 7 * (WEEKS_AFTER + 1))

    const result = []
    for (let day = new Date(first); day < last; day = addDays(day, 1)) result.push(day)
    return result
  }, [thisWeekKey, selectedWeekKey])

  useEffect(() => {
    const scroller = scrollerRef.current
    const item = scroller?.querySelector(`[data-date="${selectedKey}"]`)
    if (!item) return

    scroller.scrollTo({
      left: item.offsetLeft - (scroller.clientWidth - item.offsetWidth) / 2,
      behavior: hasScrolled.current ? 'smooth' : 'instant',
    })
    hasScrolled.current = true
  }, [selectedKey, days])

  return (
    <div ref={scrollerRef} className="no-scrollbar relative -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:px-0">
      {days.map((day) => {
        const key = toDateKey(day)
        const isSelected = key === selectedKey
        const isToday = isSameDay(day, today)

        let textColor = 'text-subtle'
        if (isSelected) textColor = 'bg-primary text-white'
        else if (isToday) textColor = 'text-primary'

        return (
          <button
            key={key}
            type="button"
            data-date={key}
            onClick={() => onSelect(day)}
            aria-pressed={isSelected}
            aria-label={day.toDateString()}
            className={`flex h-[63px] w-[39px] shrink-0 flex-col items-center justify-center ${textColor}`}
          >
            <span className="text-xs leading-4">{formatWeekday(day)}</span>
            <span className="mt-1 text-[17px] leading-6">{formatDayOfMonth(day)}</span>
            <span
              className={`mt-0.5 size-1 rounded-full ${
                markedDays.has(key) ? (isSelected ? 'bg-white' : 'bg-primary') : ''
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
