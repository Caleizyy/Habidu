import { z } from 'zod';

export const createHabitLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  value: z.number().nonnegative('Value must be a non-negative number'),
});

export type CreateHabitLogRequest = z.infer<typeof createHabitLogSchema>;

export const updateHabitLogSchema = z.object({
  value: z.number().nonnegative('Value must be a non-negative number').optional(),
});

export type UpdateHabitLogRequest = z.infer<typeof updateHabitLogSchema>;

export const habitLogQuerySchema = z
  .object({
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .passthrough();

export type HabitLogQuery = z.infer<typeof habitLogQuerySchema>;
