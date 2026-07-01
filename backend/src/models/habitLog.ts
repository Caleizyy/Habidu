import { Schema, model, Document, Types } from 'mongoose';

export interface IHabitLog extends Document {
  habitId: Types.ObjectId;
  date: Date;
  value: number;
  userId?: string;
}

const HabitLogSchema = new Schema<IHabitLog>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: { type: String },
  },
  { timestamps: true }
);

export const HabitLog = model<IHabitLog>('HabitLog', HabitLogSchema);

HabitLog.collection
  .createIndex(
    { habitId: 1, userId: 1, date: 1 },
    { unique: true, partialFilterExpression: { userId: { $type: 'string' } }, background: true }
  )
  .catch(() => {});
