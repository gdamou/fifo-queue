import { Action } from '@fifo-queue/shared';
import { Coins, PlusCircle } from 'lucide-react';
import { HStack, styled } from '../../styled-system/jsx';
import { useQueueManager } from '../hooks/useQueueManager';
import { ActionIcon } from './ActionIcon';
import { formatAction } from '../utils/format';
import { useToast } from '../context/ToastContext';

type ActionProps = {
    action: Action;
    inQueue?: boolean;
    remainingCredits?: number;
    totalCredits?: number;
};

export const ActionCard = ({ action, inQueue = false, remainingCredits, totalCredits }: ActionProps) => {
    const { sendActionToQueue } = useQueueManager();

    const toast = useToast();

    const handleActionAdded = async () => {
        const isActionAdded = await sendActionToQueue(action);

        if (!isActionAdded) {
            toast.create({ title: 'Error', description: `Action ${action} failed to be add to the queue.` });
            return;
        }

        toast.create({ title: 'Success', description: `You added the action '${action}' to the queue.` });
    };

    return (
        <HStack alignItems="center" mb="5" gap="4">
            <HStack
                w="full"
                justifyContent="space-between"
                bg="white"
                borderRadius="15px"
                border="2px solid white"
                p="2"
                key={action}
            >
                <styled.div display="flex" gap="4" alignItems="center">
                    <styled.div borderRadius="10px" bg="secondary" color="white" p="3">
                        <ActionIcon action={action} />
                    </styled.div>
                    {formatAction(action)}
                </styled.div>
                {!inQueue && (
                    <styled.div display="flex" gap="3">
                        {`${remainingCredits}/${totalCredits}`} <Coins />{' '}
                    </styled.div>
                )}
            </HStack>
            {!inQueue && (
                <styled.button
                    onClick={handleActionAdded}
                    cursor="pointer"
                    color="white"
                    bgColor="primary"
                    rounded="xl"
                    transition="all 0.2s ease-in-out"
                    _hover={{
                        opacity: 0.8,
                    }}
                >
                    <PlusCircle size="24px" />
                </styled.button>
            )}
        </HStack>
    );
};
