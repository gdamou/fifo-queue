import express, { Request, Response } from 'express';
import { addActionToQueue, getQueueStatus } from '../services/queueService';

const queueRouter = express.Router();

queueRouter.post('/queue/add', async (req: Request, res: Response) => {
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

queueRouter.get('/queue/status', async (req: Request, res: Response) => {
    try {
        const queueStatus = await getQueueStatus();
        if (!queueStatus) {
            res.status(404).json({ error: 'Queue not found.' });
            return;
        }

        res.status(200).json(queueStatus);
    } catch (error) {
        res.status(500).json({ error: 'Error while retrieving queue status.' });
    }
});

export { queueRouter };
