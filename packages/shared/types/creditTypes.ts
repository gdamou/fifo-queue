import { z } from 'zod';
import { creditSchema } from '../schemas/creditSchema';

export type Credit = z.infer<typeof creditSchema>;
