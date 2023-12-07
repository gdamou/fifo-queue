import * as queueService from '../services/queueService';
import { QUEUE_NAME } from '../constants/queueConstants';
import { QueueStatus } from '@fifo-queue/shared';
import { deepCopy } from '../utils/deepCopy';

jest.mock('../clients/redisClient', () => ({
    ...jest.requireActual('../clients/redisClient'), // Import the actual implementations of other functions
    redisClient: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

const mockedQueueStatusGet = jest.spyOn(queueService, 'getQueueStatus');
const mockedQueueStatusSet = jest.spyOn(queueService, 'setQueueStatus');

const baseMockQueueStatus: QueueStatus = {
    details: {
        name: QUEUE_NAME,
        credits: {
            total: {
                SEND_EMAIL: 10,
                SEND_PRIVATE_MESSAGE: 15,
                FIND_LEAD: 5,
            },
            remaining: {
                SEND_EMAIL: 5,
                SEND_PRIVATE_MESSAGE: 10,
                FIND_LEAD: 3,
            },
        },
        lastResetCreditAt: new Date(),
        lastActionDequeuedAt: new Date(),
    },
    queue: ['SEND_EMAIL', 'FIND_LEAD'],
};

describe('Queue Service', () => {
    describe('initializeQueue', () => {
        it('should initialize the queue correctly', async () => {
            await queueService.initializeQueue();

            expect(mockedQueueStatusSet).toHaveBeenCalledWith(
                expect.objectContaining({
                    details: expect.objectContaining({
                        credits: expect.objectContaining({
                            total: expect.objectContaining({
                                SEND_EMAIL: expect.any(Number),
                                SEND_PRIVATE_MESSAGE: expect.any(Number),
                                FIND_LEAD: expect.any(Number),
                            }),
                            remaining: expect.objectContaining({
                                SEND_EMAIL: expect.any(Number),
                                SEND_PRIVATE_MESSAGE: expect.any(Number),
                                FIND_LEAD: expect.any(Number),
                            }),
                        }),
                    }),
                })
            );
        });
    });
    describe('Queue manipulation', () => {
        let mockQueueStatus: QueueStatus;

        beforeEach(() => {
            mockQueueStatus = deepCopy<QueueStatus>(baseMockQueueStatus);
            mockedQueueStatusGet.mockResolvedValue(mockQueueStatus);
        });

        describe('refreshCredits', () => {
            it('should refresh credits in the queue status', async () => {
                await queueService.refreshCredits(mockQueueStatus);

                expect(mockedQueueStatusSet).toHaveBeenCalledWith(
                    expect.objectContaining({
                        details: expect.objectContaining({
                            credits: expect.objectContaining({
                                total: expect.not.objectContaining({
                                    SEND_EMAIL: 10,
                                }),
                            }),
                        }),
                    })
                );
            });
        });
        describe('addActionToQueue', () => {
            it('should add an action to the queue', async () => {
                const action = 'SEND_EMAIL';
                const mockQueueStatus = deepCopy<QueueStatus>(baseMockQueueStatus);
                mockedQueueStatusGet.mockResolvedValue(mockQueueStatus);
                await queueService.addActionToQueue(mockQueueStatus, action);

                expect(mockQueueStatus.queue).toHaveLength(baseMockQueueStatus.queue.length + 1);
                expect(mockQueueStatus.queue[mockQueueStatus.queue.length - 1]).toBe(action);
                expect(mockedQueueStatusSet).toHaveBeenCalledWith(mockQueueStatus);
            });
        });

        describe('removeFirstAvailableAction', () => {
            it('should remove the first action from the queue', async () => {
                const initialLength = mockQueueStatus.queue.length;
                await queueService.removeFirstAvailableAction(mockQueueStatus);

                expect(mockQueueStatus.queue.length).toBe(initialLength - 1);
            });
            it('should remove the first available action from the queue', async () => {
                const modifiedMockQueueStatus = {
                    ...mockQueueStatus,
                    details: {
                        ...mockQueueStatus.details,
                        credits: {
                            ...mockQueueStatus.details.credits,
                            remaining: { ...mockQueueStatus.details.credits.remaining, SEND_EMAIL: 0 },
                        },
                    },
                };

                const initialLength = modifiedMockQueueStatus.queue.length;
                await queueService.removeFirstAvailableAction(modifiedMockQueueStatus);

                expect(modifiedMockQueueStatus.queue.length).toBe(initialLength - 1);
                expect(modifiedMockQueueStatus.queue[0]).toBe('SEND_EMAIL');
            });
            it('should remove no action from the queue', async () => {
                const modifiedMockQueueStatus = {
                    ...mockQueueStatus,
                    details: {
                        ...mockQueueStatus.details,
                        credits: {
                            ...mockQueueStatus.details.credits,
                            remaining: { ...mockQueueStatus.details.credits.remaining, SEND_EMAIL: 0, FIND_LEAD: 0 },
                        },
                    },
                };

                const initialLength = modifiedMockQueueStatus.queue.length;
                await queueService.removeFirstAvailableAction(modifiedMockQueueStatus);

                expect(modifiedMockQueueStatus.queue.length).toBe(initialLength);
            });
        });
    });
});
