import { z } from 'zod';
import { redisClient } from '../clients/redisClient';
import { MAX_CREDITS_PER_ACTION, MIN_CREDITS_VARIATION, QUEUE_NAME } from '../constants/queueConstants';
import { Action } from '../types/actionTypes';
import { Credit } from '../types/creditTypes';
import { QueueStatus } from '../types/queueTypes';
import { queueStatusSchema } from '../schemas/queueStatusSchema';

export const setQueueStatus = async (queueStatus: QueueStatus) => {
    await redisClient.set(QUEUE_NAME, JSON.stringify(queueStatus));
};

export const initializeQueue = async () => {
    const randomizedCredits = getRandomizedCredits();
    const queueStatus: QueueStatus = {
        details: {
            name: QUEUE_NAME,
            credits: {
                total: randomizedCredits,
                remaining: randomizedCredits,
            },
            lastResetCreditAt: new Date(),
            lastActionDequeuedAt: new Date(),
        },
        queue: [],
    };

    await setQueueStatus(queueStatus);
};

const getRandomizedCredits = () => {
    let randomizedCredits: Credit = {
        SEND_EMAIL: 0,
        SEND_PRIVATE_MESSAGE: 0,
        FIND_LEAD: 0,
    };

    for (const action in MAX_CREDITS_PER_ACTION) {
        if (MAX_CREDITS_PER_ACTION.hasOwnProperty(action)) {
            const key = action as keyof Credit;
            const maxCredit = MAX_CREDITS_PER_ACTION[key];
            const minCredit = Math.ceil(MIN_CREDITS_VARIATION * maxCredit);
            randomizedCredits[key] = Math.floor(Math.random() * (maxCredit - minCredit + 1)) + minCredit;
        }
    }

    return randomizedCredits;
};

export const refreshCredits = async (queueStatus: QueueStatus) => {
    const { details } = queueStatus;
    const { credits } = details;

    const randomizedCredits = getRandomizedCredits();
    credits.total = randomizedCredits;
    credits.remaining = randomizedCredits;
    details.lastResetCreditAt = new Date();
    await setQueueStatus(queueStatus);
};

export const addActionToQueue = async (queueStatus: QueueStatus, action: Action) => {
    const { queue } = queueStatus;
    queue.push(action);
    await setQueueStatus(queueStatus);
    return queueStatus;
};

export const getQueueStatus = async (): Promise<QueueStatus | undefined> => {
    const queueStatus = await redisClient.get(QUEUE_NAME);
    if (queueStatus !== null) {
        try {
            const parsedQueueStatus = JSON.parse(queueStatus);
            return queueStatusSchema.parse(parsedQueueStatus);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Invalid queue status:', error.errors);
            }
        }
    }
    return;
};

export const removeFirstAvailableAction = async (queueStatus: QueueStatus): Promise<QueueStatus | undefined> => {
    const { queue, details } = queueStatus;

    if (queue.length === 0) {
        return;
    }

    const { remaining } = details.credits;
    const action = await getFirstAvailableAction(queue, remaining);

    if (!action) {
        return;
    }

    queue.splice(queue.indexOf(action), 1);

    details.lastActionDequeuedAt = new Date();
    details.credits.remaining[action] -= 1;
    await setQueueStatus(queueStatus);
    return queueStatus;
};

// First action that has enough credits to be removed
const getFirstAvailableAction = async (queue: Action[], remaining: Credit) => {
    for (const action of queue) {
        if (remaining[action] > 0) {
            return action;
        }
    }
};
