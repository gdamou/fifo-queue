import { z } from 'zod';
import { ACTIONS } from '../constants/queueConstants';

export const actionSchema = z.object({
    action: z.enum(ACTIONS),
});
