import Task from '../models/Task.js'
import {
  createTaskSchema,
  listTasksQuery,
  updateTaskSchema,
  weeklySummaryQuery,
} from '../validators/task.js'

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function listTasks(req, res) {
  const { search, status, priority, from, to } = listTasksQuery.parse(req.query)
  const filter = {}

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ title: pattern }, { description: pattern }]
  }
  if (status) filter.status = status
  if (priority) filter.priority = priority
  if (from || to) {
    filter.startsAt = {}
    if (from) filter.startsAt.$gte = from
    if (to) filter.startsAt.$lt = to
  }

  const tasks = await Task.find(filter).sort({ startsAt: 1 })
  res.json(tasks)
}

export async function getWeeklySummary(req, res) {
  const { tz } = weeklySummaryQuery.parse(req.query)

  const weeks = await Task.aggregate([
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$startsAt', unit: 'week', startOfWeek: 'monday', timezone: tz },
        },
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        start: '$_id',
        end: { $dateAdd: { startDate: '$_id', unit: 'week', amount: 1, timezone: tz } },
        open: { $subtract: ['$total', '$completed'] },
        completed: 1,
        total: 1,
      },
    },
  ])

  res.json(weeks)
}

export async function getTask(req, res) {
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  res.json(task)
}

export async function createTask(req, res) {
  const data = createTaskSchema.parse(req.body ?? {})
  const task = await Task.create(data)

  res.status(201).json(task)
}

export async function updateTask(req, res) {
  const changes = updateTaskSchema.parse(req.body ?? {})

  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  task.set(changes)
  await task.save()

  res.json(task)
}

export async function deleteTask(req, res) {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  res.status(204).end()
}
