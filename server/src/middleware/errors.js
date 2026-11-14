import mongoose from 'mongoose'
import { ZodError } from 'zod'

const validationFailed = (res, details) => res.status(400).json({ error: 'Validation failed', details })

export function notFound(req, res) {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` })
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return validationFailed(
      res,
      err.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    )
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return validationFailed(
      res,
      Object.values(err.errors).map((error) => ({ field: error.path, message: error.message })),
    )
  }

  if (err.expose && err.status < 500) {
    return res.status(err.status).json({ error: err.message })
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
