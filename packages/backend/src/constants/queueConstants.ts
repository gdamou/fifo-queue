export const QUEUE_NAME = 'mainQueue';

export const ACTIONS = ['SEND_EMAIL', 'SEND_PRIVATE_MESSAGE', 'FIND_LEAD'] as const;

export const MIN_CREDITS_VARIATION = 0.8;

export const MAX_CREDITS_PER_ACTION = {
    SEND_EMAIL: 20,
    SEND_PRIVATE_MESSAGE: 30,
    FIND_LEAD: 20,
};
