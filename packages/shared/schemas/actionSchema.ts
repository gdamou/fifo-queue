import { z } from 'zod';
import { ACTIONS } from '../actions';

export const actionSchema = z.object({
    action: z.enum(ACTIONS),
});
