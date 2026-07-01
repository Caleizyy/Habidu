import { z } from 'zod';
import {
  HABIT_CATEGORIES,
  HABIT_FREQUENCIES,
  HABIT_DIFFICULTIES,
  isValidCategory,
  isValidFrequency,
  isValidDifficulty,
} from '../utils/enumValidator';

export const createHabitSchema = z
  .object({
    name: z.string().min(1, 'Habit name is required').max(100, 'Habit name must be 100 characters or less'),
    description: z.string().max(500, 'Description must be 500 characters or less').optional(),
    category: z.string().refine(isValidCategory, {
      message: `Category must be one of: ${HABIT_CATEGORIES.join(', ')}`,
    }),
    frequency: z.string().refine(isValidFrequency, {
      message: `Frequency must be one of: ${HABIT_FREQUENCIES.join(', ')}`,
    }),
    difficulty: z.string().refine(isValidDifficulty, {
      message: `Difficulty must be one of: ${HABIT_DIFFICULTIES.join(', ')}`,
    }),
    targetValue: z.number().positive('Target value must be a positive number'),
    targetUnit: z.string().min(1, 'Target unit is required').max(20, 'Target unit must be 20 characters or less'),
    notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
    groupId: z
      .string()
      .regex(/^[0-9a-f]{24}$/, 'Group ID must be a valid MongoDB ObjectId')
      .optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .optional(),
  })
  .refine((data) => !data.groupId || data.frequency === 'Weekly', {
    message: 'Group habits must have a Weekly frequency',
    path: ['frequency'],
  });

export type CreateHabitRequest = z.infer<typeof createHabitSchema>;

export const updateHabitSchema = z
  .object({
    name: z.string().min(1, 'Habit name is required').max(100, 'Habit name must be 100 characters or less').optional(),
    description: z.string().max(500, 'Description must be 500 characters or less').optional(),
    category: z
      .string()
      .refine(isValidCategory, {
        message: `Category must be one of: ${HABIT_CATEGORIES.join(', ')}`,
      })
      .optional(),
    frequency: z
      .string()
      .refine(isValidFrequency, {
        message: `Frequency must be one of: ${HABIT_FREQUENCIES.join(', ')}`,
      })
      .optional(),
    difficulty: z
      .string()
      .refine(isValidDifficulty, {
        message: `Difficulty must be one of: ${HABIT_DIFFICULTIES.join(', ')}`,
      })
      .optional(),
    targetValue: z.number().positive('Target value must be a positive number').optional(),
    targetUnit: z
      .string()
      .min(1, 'Target unit is required')
      .max(20, 'Target unit must be 20 characters or less')
      .optional(),
    notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
    groupId: z
      .union([z.string().regex(/^[0-9a-f]{24}$/, 'Group ID must be a valid MongoDB ObjectId'), z.null()])
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => !data.groupId || data.frequency === undefined || data.frequency === 'Weekly', {
    message: 'Group habits must have a Weekly frequency',
    path: ['frequency'],
  });

export type UpdateHabitRequest = z.infer<typeof updateHabitSchema>;
