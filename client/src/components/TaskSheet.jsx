import { CalendarDays, Clock3, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { tasksApi } from '../api/tasks.js'
import { formatLongDate, formatTimeValue, fromDateKey, toDateKey, toTimeValue } from '../lib/date.js'

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

function initialForm(task, defaultDate) {
  if (!task) {
    return { title: '', description: '', date: toDateKey(defaultDate), start: '', end: '', priority: '' }
  }

  const startsAt = new Date(task.startsAt)
  return {
    title: task.title,
    description: task.description,
    date: toDateKey(startsAt),
    start: toTimeValue(startsAt),
    end: task.endsAt ? toTimeValue(new Date(task.endsAt)) : '',
    priority: task.priority ?? '',
  }
}

function validate(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Give the task a title'
  if (!form.start) errors.startsAt = 'Pick a start time'
  if (!form.date) errors.date = 'Pick a date'
  if (form.start && form.end && form.end <= form.start) errors.endsAt = 'Must be after the start time'
  return errors
}

const fieldClass =
  'w-full border bg-white px-2.5 text-sm text-ink outline-none placeholder:text-ink/70 focus:border-primary'

export default function TaskSheet({ task, defaultDate, onClose, onSaved, onDeleted }) {
  const dialogRef = useRef(null)
  const isEditing = Boolean(task)

  const [form, setForm] = useState(() => initialForm(task, defaultDate))
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e) {
    e.preventDefault()

    const clientErrors = validate(form)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    const toIso = (time) => new Date(`${form.date}T${time}`).toISOString()
    const payload = {
      title: form.title,
      description: form.description,
      startsAt: toIso(form.start),
      endsAt: form.end ? toIso(form.end) : null,
      priority: form.priority || null,
    }

    setSaving(true)
    setSubmitError(null)
    try {
      const saved = isEditing ? await tasksApi.update(task.id, payload) : await tasksApi.create(payload)
      onSaved(saved)
    } catch (err) {
      if (err.details?.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])))
      } else {
        setSubmitError(err.message)
      }
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await tasksApi.remove(task.id)
      onDeleted(task)
    } catch (err) {
      setSubmitError(err.message)
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="task-sheet-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="mx-auto mt-auto mb-0 max-h-[92dvh] w-full max-w-[430px] overflow-y-auto overscroll-contain bg-white p-0 text-ink transition-[translate,opacity] duration-300 ease-out backdrop:bg-black/25 starting:open:translate-y-full md:mb-auto md:max-w-lg md:starting:open:translate-y-6 md:starting:open:opacity-0"
    >
      <form onSubmit={handleSubmit} noValidate className="px-6 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <h2 id="task-sheet-title" className="text-lg leading-7 font-medium">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-1 grid size-8 place-items-center">
            <X className="size-6" strokeWidth={1.5} />
          </button>
        </div>

        <Field label="Task title" htmlFor="task-title" error={errors.title} className="mt-7.5">
          <input
            id="task-title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            maxLength={100}
            placeholder="Doing Homework"
            aria-invalid={Boolean(errors.title)}
            className={`${fieldClass} h-10 ${errors.title ? 'border-red-500' : 'border-field'}`}
          />
        </Field>

        <Field label="Set Time" error={errors.startsAt || errors.endsAt}>
          <div className="grid grid-cols-2 gap-[30px]">
            <PickerInput
              type="time"
              label="Start time"
              value={form.start}
              onChange={(value) => setField('start', value)}
              placeholder="Start"
              display={formatTimeValue}
              icon={Clock3}
              invalid={Boolean(errors.startsAt)}
            />
            <PickerInput
              type="time"
              label="End time (optional)"
              value={form.end}
              onChange={(value) => setField('end', value)}
              placeholder="Ends"
              display={formatTimeValue}
              icon={Clock3}
              invalid={Boolean(errors.endsAt)}
            />
          </div>
        </Field>

        <Field label="Set Date" error={errors.date}>
          <PickerInput
            type="date"
            label="Date"
            value={form.date}
            onChange={(value) => setField('date', value)}
            placeholder="Pick a date"
            display={(value) => formatLongDate(fromDateKey(value))}
            icon={CalendarDays}
            iconAtEnd
            invalid={Boolean(errors.date)}
          />
        </Field>

        <Field label="Priority" error={errors.priority}>
          <div role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-3">
            {PRIORITIES.map(({ value, label }) => {
              const checked = form.priority === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setField('priority', checked ? '' : value)}
                  className={`h-10 border text-sm transition-colors ${
                    checked ? 'border-primary bg-primary text-white' : 'border-field bg-white'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Description" htmlFor="task-description" error={errors.description}>
          <textarea
            id="task-description"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            maxLength={1000}
            placeholder="Add Description"
            className={`${fieldClass} h-[100px] resize-none border-field py-2.5`}
          />
        </Field>

        {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-[26px] h-12 w-full bg-primary font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {isEditing ? 'Save changes' : 'Create task'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="mt-3 h-10 w-full text-sm font-medium text-red-600 disabled:opacity-60"
          >
            Delete task
          </button>
        )}
      </form>
    </dialog>
  )
}

function Field({ label, htmlFor, error, className = 'mt-[22px]', children }) {
  const Label = htmlFor ? 'label' : 'p'

  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-2 block text-xs leading-5 font-medium text-muted">
        {label}
      </Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function PickerInput({ type, label, value, onChange, placeholder, display, icon: Icon, iconAtEnd, invalid }) {
  const icon = <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />

  return (
    <div
      className={`relative flex h-10 items-center gap-3 border bg-white px-2.5 text-sm focus-within:border-primary ${
        invalid ? 'border-red-500' : 'border-field'
      }`}
    >
      {!iconAtEnd && icon}
      <span className={`flex-1 truncate ${value ? '' : 'text-ink/70'}`}>{value ? display(value) : placeholder}</span>
      {iconAtEnd && icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker()
          } catch {}
        }}
        aria-label={label}
        aria-invalid={invalid}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </div>
  )
}
