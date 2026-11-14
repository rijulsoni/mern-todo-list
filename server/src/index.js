import mongoose from 'mongoose'
import app from './app.js'
import config from './config.js'

if (!config.mongoUri) {
  console.error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

await mongoose.connect(config.mongoUri)
console.log('Connected to MongoDB')

const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`)
})

async function shutdown() {
  server.close()
  await mongoose.disconnect()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
