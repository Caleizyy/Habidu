import { Request, Response } from 'express';
import * as habitService from '../services/habitService';
import { CreateHabitBody, HabitQueryFilter } from '../types';

export const find = async (req: Request<object, object, object, HabitQueryFilter>, res: Response) => {
  try {
    const habits = await habitService.find({ ...req.query, createdBy: res.locals.sub });

    res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

export const create = async (req: Request<object, object, CreateHabitBody>, res: Response) => {
  const { name, category, frequency, difficulty, notes } = req.body;

  if (!name || !category || !frequency || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newHabit = await habitService.create({ ...req.body, createdBy: res.locals.sub });
    return res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return res.status(500).json({ error: 'Failed to create habit' });
  }
};
