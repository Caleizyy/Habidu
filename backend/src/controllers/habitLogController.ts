import { Request, Response } from 'express';
import * as habitLogService from '../services/habitLogService';
import { CreateHabitLogBody } from '../types';

export const create = async (req: Request<{ habitId: string }, object, CreateHabitLogBody>, res: Response) => {
  const { habitId } = req.params;
  const { date, value } = req.body;

  if (!date || value === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: date (YYYY-MM-DD), value',
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
      received: date,
    });
  }

  if (typeof value !== 'number' || value < 0) {
    return res.status(400).json({
      error: 'Value must be a non-negative number',
      received: value,
    });
  }

  try {
    const log = await habitLogService.create({
      habitId,
      date,
      value,
    });
    return res.status(201).json(log);
  } catch (error: unknown) {
    console.error('Error creating habit log:', error);
    if (error instanceof Object && 'code' in error && (error as Record<string, unknown>).code === 11000) {
      return res.status(409).json({
        error: 'A log entry already exists for this habit and date',
      });
    }
    return res.status(500).json({ error: 'Failed to create habit log' });
  }
};

export const findByHabitId = async (
  req: Request<{ habitId: string }, object, object, { from?: string; to?: string }>,
  res: Response
) => {
  const { habitId } = req.params;
  const { from, to } = req.query;

  try {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const logs = await habitLogService.findByHabitId(habitId, fromDate, toDate);
    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching habit logs:', error);
    return res.status(500).json({ error: 'Failed to fetch habit logs' });
  }
};

export const update = async (
  req: Request<{ habitId: string; logId: string }, object, { value: number }>,
  res: Response
) => {
  const { logId } = req.params;
  const { value } = req.body;

  if (typeof value !== 'number' || value < 0) {
    return res.status(400).json({
      error: 'Value must be a non-negative number',
      received: value,
    });
  }

  try {
    const log = await habitLogService.update(logId, value);
    if (!log) {
      return res.status(404).json({ error: 'Habit log not found' });
    }
    return res.status(200).json(log);
  } catch (error) {
    console.error('Error updating habit log:', error);
    return res.status(500).json({ error: 'Failed to update habit log' });
  }
};

export const remove = async (req: Request<{ habitId: string; logId: string }>, res: Response) => {
  const { logId } = req.params;

  try {
    const log = await habitLogService.remove(logId);
    if (!log) {
      return res.status(404).json({ error: 'Habit log not found' });
    }
    return res.status(200).json({ message: 'Habit log deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit log:', error);
    return res.status(500).json({ error: 'Failed to delete habit log' });
  }
};

export const upsert = async (req: Request<{ habitId: string }, object, CreateHabitLogBody>, res: Response) => {
  const { habitId } = req.params;
  const { date, value } = req.body;

  if (!date || value === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: date (YYYY-MM-DD), value',
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
      received: date,
    });
  }

  if (typeof value !== 'number' || value < 0) {
    return res.status(400).json({
      error: 'Value must be a non-negative number',
      received: value,
    });
  }

  try {
    const log = await habitLogService.upsert(habitId, date, value);
    return res.status(200).json(log);
  } catch (error: unknown) {
    console.error('Error upserting habit log:', error);
    return res.status(500).json({ error: 'Failed to upsert habit log' });
  }
};
