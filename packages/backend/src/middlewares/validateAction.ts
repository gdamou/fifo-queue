import { Request, Response, NextFunction } from 'express';
import { actionSchema } from '../schemas/actionSchema';

export const validateActionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = actionSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json(result.error);
    }

    next();
};
