import express, { Request, Response } from 'express';
import { addActionToQueue, getQueueStatus } from '../services/queueService';
import { validateActionMiddleware } from '../middlewares/validateAction';
import { queueStatusSchema } from '@fifo-queue/shared';

const queueRouter = express.Router();

queueRouter.post('/add', validateActionMiddleware, async (req: Request, res: Response) => {
    try {
        const { action } = req.body;

        const queueStatus = await getQueueStatus();
        if (!queueStatus) {
            res.status(404).json({ error: 'Queue not found.' });
            return;
        }

        await addActionToQueue(queueStatus, action);
        res.status(200).json(queueStatus);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error : 'Error while enqueueing action.' });
    }
});

queueRouter.get('/status', async (req: Request, res: Response) => {
    try {
        const queueStatus = await getQueueStatus();
        if (!queueStatus) {
            res.status(404).json({ error: 'Queue not found.' });
            return;
        }

        const validationResult = queueStatusSchema.safeParse(queueStatus);

        if (validationResult.success) {
            res.status(200).json(validationResult.data);
        } else {
            res.status(500).json({ error: validationResult.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error while retrieving queue status.' });
    }
});

export { queueRouter };
