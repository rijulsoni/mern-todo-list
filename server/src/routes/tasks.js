import { Router } from 'express'
import mongoose from 'mongoose'
import {
  createTask,
  deleteTask,
  getTask,
  getWeeklySummary,
  listTasks,
  updateTask,
} from '../controllers/tasks.js'

const router = Router()

router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(404).json({ error: 'Task not found' })
  }
  next()
})

router.get('/', listTasks)
router.post('/', createTask)
router.get('/weekly-summary', getWeeklySummary)
router.get('/:id', getTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
