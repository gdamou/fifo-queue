import { QueueStatus, type Credit } from '@fifo-queue/shared';
import { styled } from '../../styled-system/jsx';
import { ActionCard } from './ActionCard';
import { formatDate } from '../utils/format';

export const ActionList = ({ details }: { details: QueueStatus['details'] }) => {
    const { credits, lastResetCreditAt, lastActionDequeuedAt } = details;
    const actions = Object.keys(credits.total) as Array<keyof Credit>;

    return (
        <styled.div px="3" minW="25rem" gap="10">
            <styled.h2 mb="5" ml="2" fontSize="2xl" fontWeight="semibold">
                Actions
            </styled.h2>

            {actions.map((action) => (
                <ActionCard
                    action={action}
                    remainingCredits={credits.remaining[action]}
                    totalCredits={credits.total[action]}
                    key={action}
                />
            ))}
            <styled.div ml="2" fontSize="sm">
                <styled.div mb="1">Last action removed : {formatDate(lastActionDequeuedAt)}</styled.div>
                <styled.div>Last credits reset : {formatDate(lastResetCreditAt)}</styled.div>
            </styled.div>
        </styled.div>
    );
};
