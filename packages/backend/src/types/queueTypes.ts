import { ActionQueue } from './actionTypes';
import { Credit } from './creditTypes';

export type QueueStatus = {
    details: {
        name: string;
        credits: {
            total: Credit;
            remaining: Credit;
        };
        lastResetCreditAt: Date;
        lastActionDequeuedAt: Date;
    };
    queue: ActionQueue;
};
