import { QueueStatus } from '@fifo-queue/shared';
import { styled } from '../../styled-system/jsx';
import { ActionCard } from './ActionCard';

export const QueueList = ({ queue }: { queue: QueueStatus['queue'] }) => {
    return (
        <styled.div w="full" h="full" px="5" overflowY="auto">
            {queue.map((action, key) => (
                <ActionCard key={key} action={action} inQueue={true} />
            ))}
        </styled.div>
    );
};
