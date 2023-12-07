import { queueStatusSchema } from '../schemas/queueStatusSchema';
import { z } from 'zod';

export type QueueStatus = z.infer<typeof queueStatusSchema>;
