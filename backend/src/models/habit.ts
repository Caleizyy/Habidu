import { Schema, model, Document } from 'mongoose';

import { HabitCategory, HabitDifficulty, HabitFrequency } from '../types';

export interface Habit extends Document {
  name: string;

  frequency: HabitFrequency;

  difficulty: HabitDifficulty;

  category: HabitCategory;

  notes?: string;
}

const HabitSchema = new Schema<Habit>(
  {
    name: { type: String, required: true },

    frequency: { type: String, enum: Object.values(HabitFrequency), required: true },

    difficulty: { type: String, enum: Object.values(HabitDifficulty), required: true },

    category: { type: String, enum: Object.values(HabitCategory), required: true },

    notes: { type: String, default: null },
  },

  { timestamps: true }
);

export const Habit = model<Habit>('Habit', HabitSchema);
