import mongoose from 'mongoose'

export const PRIORITIES = ['low', 'medium', 'high']
export const STATUSES = ['in_progress', 'completed']

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, default: null },
    priority: { type: String, enum: [...PRIORITIES, null], default: null },
    status: { type: String, enum: STATUSES, default: 'in_progress' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret._id
        return ret
      },
    },
  },
)

taskSchema.pre('validate', function () {
  if (this.endsAt && this.endsAt <= this.startsAt) {
    this.invalidate('endsAt', 'End time must be after the start time')
  }
})

taskSchema.index({ startsAt: 1 })

export default mongoose.model('Task', taskSchema)
