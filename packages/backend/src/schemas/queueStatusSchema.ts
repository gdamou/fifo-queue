import { z } from 'zod';
import { ACTIONS } from '../constants/queueConstants';
import { creditSchema } from './creditSchema';

// Since we are using zod, we can use preprocess to convert string from JSON string to Date
const dateSchema = z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
    }
}, z.date());

export const queueStatusSchema = z.object({
    details: z.object({
        name: z.string(),
        credits: z.object({
            total: creditSchema,
            remaining: creditSchema,
        }),
        lastResetCreditAt: dateSchema,
        lastActionDequeuedAt: dateSchema,
    }),
    queue: z.array(z.enum(ACTIONS)),
});
