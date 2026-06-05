import { Request, Response } from 'express';
import * as habitService from '../services/habitService';
import { CreateHabitBody, HabitQueryFilter, UpdateHabitBody } from '../types';

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
  try {
    const newHabit = await habitService.create(req.body);
    return res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return res.status(500).json({ error: 'Failed to create habit' });
  }
};

export const updateOne = async (req: Request<{ id: string }, object, UpdateHabitBody>, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updatedHabit = await habitService.updateById(id, data);
    return res.status(200).json(updatedHabit);
  } catch (error) {
    console.error('Error updating habit:', error);
    return res.status(500).json({ error: 'Failed to update habit' });
  }
};

export const deleteOne = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  try {
    await habitService.deleteById(id);
    return res.status(204);
  } catch (error) {
    console.error('Error deleting habit:', error);
    return res.status(500).json({ error: 'Failed to delete habit' });
  }
};
