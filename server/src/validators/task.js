import { z } from 'zod'
import { PRIORITIES, STATUSES } from '../models/Task.js'

function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone })
    return true
  } catch {
    return false
  }
}

const dateTime = (label) =>
  z.iso
    .datetime({
      offset: true,
      error: (issue) =>
        issue.input === undefined ? `${label} is required` : `${label} must be an ISO 8601 date-time`,
    })
    .transform((value) => new Date(value))

const priority = z.enum(PRIORITIES, { error: `Priority must be one of: ${PRIORITIES.join(', ')}` })
const status = z.enum(STATUSES, { error: `Status must be one of: ${STATUSES.join(', ')}` })

export const createTaskSchema = z.object({
  title: z
    .string({ error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string().trim().max(1000, 'Description must be at most 1000 characters').optional(),
  startsAt: dateTime('Start time'),
  endsAt: dateTime('End time').nullable().optional(),
  priority: priority.nullable().optional(),
  status: status.optional(),
})

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, 'Nothing to update')

export const listTasksQuery = z.object({
  search: z.string().trim().min(3, 'Search must be at least 3 characters').max(100).optional(),
  status: status.optional(),
  priority: priority.optional(),
  from: dateTime('from').optional(),
  to: dateTime('to').optional(),
})

export const weeklySummaryQuery = z.object({
  tz: z.string().default('UTC').refine(isValidTimeZone, 'Unknown time zone'),
})
