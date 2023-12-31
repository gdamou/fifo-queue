import { z } from 'zod';
import { ACTIONS } from '../actions';
import { Action } from '../types/actionTypes';

export const creditSchema = z.object(
    ACTIONS.reduce((acc, action) => {
        acc[action] = z.number();
        return acc;
    }, {} as Record<Action, z.ZodNumber>)
);
