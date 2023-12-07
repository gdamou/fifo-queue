import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { queueStatusSchema } from '@fifo-queue/shared';
import { useQueue } from '../context/QueueContext';

type ConnectionStatus = 'Connecting' | 'Open' | 'Closing' | 'Closed' | 'Uninstantiated';

export const useCustomWebSocket = (url: string) => {
    const { lastMessage, readyState } = useWebSocket(url, {
        shouldReconnect: () => true,
    });

    const { setQueueStatus } = useQueue();

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState] as ConnectionStatus;

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const messageData = JSON.parse(lastMessage.data);
                const validatedData = queueStatusSchema.parse(messageData);
                setQueueStatus(validatedData);
            } catch (error) {
                console.error('Failed to validate message', error);
            }
        }
    }, [lastMessage]);

    return { connectionStatus };
};
