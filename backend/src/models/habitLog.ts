import { Schema, model, Document, Types } from 'mongoose';

export interface IHabitLog extends Document {
  habitId: Types.ObjectId;
  date: Date;
  value: number;
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
  },
  { timestamps: true }
);

export const HabitLog = model<IHabitLog>('HabitLog', HabitLogSchema);
