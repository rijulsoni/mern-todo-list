import cors from 'cors'
import express from 'express'
import config from './config.js'
import { errorHandler, notFound } from './middleware/errors.js'
import taskRoutes from './routes/tasks.js'

const app = express()

app.use(cors({ origin: config.corsOrigins }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
