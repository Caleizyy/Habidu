import { Request, Response } from 'express';
import * as habitService from '../services/habitService';
import { CreateHabitBody, HabitQueryFilter, HabitCategory, HabitFrequency, HabitDifficulty } from '../types';
import { isValidCategory, isValidDifficulty, isValidFrequency } from '../utils/enumValidator';

export const find = async (req: Request<object, object, object, HabitQueryFilter>, res: Response) => {
  try {
    const habits = await habitService.find(req.query);

    res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

export const create = async (req: Request<object, object, CreateHabitBody>, res: Response) => {
  const { name, category, frequency, difficulty, targetValue, targetUnit, notes } = req.body;

  // Check required fields
  if (!name || !category || !frequency || !difficulty || targetValue === undefined || !targetUnit) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'category', 'frequency', 'difficulty', 'targetValue', 'targetUnit'],
    });
  }

  // Validate enum values (ensure they're lowercase and valid)
  if (!isValidCategory(category)) {
    return res.status(400).json({
      error: `Invalid category. Must be one of: ${Object.values(HabitCategory).join(', ')}`,
      received: category,
    });
  }

  if (!isValidFrequency(frequency)) {
    return res.status(400).json({
      error: `Invalid frequency. Must be one of: ${Object.values(HabitFrequency).join(', ')}`,
      received: frequency,
    });
  }

  if (!isValidDifficulty(difficulty)) {
    return res.status(400).json({
      error: `Invalid difficulty. Must be one of: ${Object.values(HabitDifficulty).join(', ')}`,
      received: difficulty,
    });
  }

  // Validate targetValue
  if (typeof targetValue !== 'number' || targetValue < 0) {
    return res.status(400).json({
      error: 'targetValue must be a non-negative number',
      received: targetValue,
    });
  }

  try {
    const newHabit = await habitService.create(req.body);
    return res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return res.status(500).json({ error: 'Failed to create habit' });
  }
};
