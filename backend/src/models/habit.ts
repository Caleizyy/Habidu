import { Schema, model, Document, Types } from 'mongoose';

import { HabitCategory, HabitDifficulty, HabitFrequency } from '../types';

export interface IHabit extends Document {
  name: string;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  category: HabitCategory;
  targetValue: number;
  targetUnit: string;
  notes?: string;
  createdBy: string;
  groupId?: Types.ObjectId;
}

const HabitSchema = new Schema<IHabit>(
  {
    name: { type: String, required: true },
    frequency: { type: String, enum: Object.values(HabitFrequency), required: true },
    difficulty: { type: String, enum: Object.values(HabitDifficulty), required: true },
    category: { type: String, enum: Object.values(HabitCategory), required: true },
    targetValue: { type: Number, required: true, min: 0 },
    targetUnit: { type: String, required: true },
    notes: { type: String },
    createdBy: { type: String, required: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  },

  { timestamps: true }
);

export const Habit = model<IHabit>('Habit', HabitSchema);
