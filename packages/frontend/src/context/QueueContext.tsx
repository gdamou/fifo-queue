import { type QueueStatus } from '@fifo-queue/shared';
import { ReactNode, createContext, useContext, useState } from 'react';

type QueueContextType = {
    queueStatus: QueueStatus | null;
    setQueueStatus: (status: QueueStatus) => void;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
    const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);

    const handleSetQueueStatus = (status: QueueStatus) => {
        setQueueStatus(status);
    };

    return (
        <QueueContext.Provider value={{ queueStatus, setQueueStatus: handleSetQueueStatus }}>
            {children}
        </QueueContext.Provider>
    );
};

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};
