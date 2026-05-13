import { Request, Response } from 'express';
import * as habitService from '../services/habitService';
import { CreateHabitBody, HabitCategory, HabitFrequency } from '../types';

export async function getByCategory(req: Request<{ category: string }>, res: Response) {
  const { category } = req.params;

  if (!Object.values(HabitCategory).includes(category as HabitCategory)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const habits = await habitService.getByCategory(category as HabitCategory);
    return res.json(habits);
  } catch (error) {
    console.error('Error fetching habits by category:', error);
    return res.status(500).json({ error: 'Failed to fetch habits by category' });
  }
}

export async function getByFrequency(req: Request<{ frequency: string }>, res: Response) {
  const { frequency } = req.params;

  if (!Object.values(HabitFrequency).includes(frequency as HabitFrequency)) {
    return res.status(400).json({ error: 'Invalid frequency' });
  }

  try {
    const habits = await habitService.getByFrequency(frequency as HabitFrequency);
    return res.json(habits);
  } catch (error) {
    console.error('Error fetching habits by frequency:', error);
    return res.status(500).json({ error: 'Failed to fetch habits by frequency' });
  }
}

export async function create(req: Request<object, object, CreateHabitBody>, res: Response) {
  const { name, category, frequency, difficulty, notes } = req.body;

  if (!name || !category || !frequency || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newHabit = await habitService.create({ name, category, frequency, difficulty, notes });
    return res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return res.status(500).json({ error: 'Failed to create habit' });
  }
}
