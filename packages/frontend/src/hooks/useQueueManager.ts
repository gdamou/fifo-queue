import { Action, queueStatusSchema } from '@fifo-queue/shared';
import { useQueue } from '../context/QueueContext';
import { API_URL } from '../config';

export const useQueueManager = () => {
    const { setQueueStatus } = useQueue();

    const sendActionToQueue = async (action: Action) => {
        try {
            const response = await fetch(`${API_URL}/queue/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ action }),
            });
            const data = await response.json();
            const validatedData = queueStatusSchema.parse(data);
            setQueueStatus(validatedData);
            return true;
        } catch (error) {
            console.error('Failed to update queue status', error);
            return false;
        }
    };

    return { sendActionToQueue };
};
