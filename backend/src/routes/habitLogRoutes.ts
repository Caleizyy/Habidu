import express from 'express';
import * as habitLogController from '../controllers/habitLogController';
import { validateBody } from '../middleware';
import { createHabitLogSchema, updateHabitLogSchema } from '../schemas/habitLogSchema';

const router = express.Router({ mergeParams: true });

router.post('/', validateBody(createHabitLogSchema), habitLogController.create);

router.get('/', habitLogController.findByHabitId);

router.put('/', validateBody(createHabitLogSchema), habitLogController.upsert);

router.put('/:logId', validateBody(updateHabitLogSchema), habitLogController.update);

router.delete('/:logId', habitLogController.remove);

export default router;
