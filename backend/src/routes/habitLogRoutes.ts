import express from 'express';
import * as habitLogController from '../controllers/habitLogController';

const router = express.Router({ mergeParams: true });

router.post('/', habitLogController.create);

router.get('/', habitLogController.findByHabitId);

router.put('/', habitLogController.upsert);

router.put('/:logId', habitLogController.update);

router.delete('/:logId', habitLogController.remove);

export default router;
