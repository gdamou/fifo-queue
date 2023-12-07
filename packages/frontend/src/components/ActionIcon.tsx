import { Action } from '@fifo-queue/shared';
import { Mail, MessageCircle, ScanSearch } from 'lucide-react';

export const ActionIcon = ({ action, ...props }: { action: Action }) => {
    if (action === 'SEND_EMAIL') {
        return <Mail size="18px" {...props} />;
    }

    if (action === 'SEND_PRIVATE_MESSAGE') {
        return <MessageCircle size="18px" {...props} />;
    }

    if (action === 'FIND_LEAD') {
        return <ScanSearch size="18px" {...props} />;
    }
};
