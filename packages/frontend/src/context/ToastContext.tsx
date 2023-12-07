import { ReactNode, createContext, useContext } from 'react';

import { createToaster } from '@ark-ui/react';
import * as Toast from '../components//ui/toast';
import { HStack, styled } from '../../styled-system/jsx';
import { Check, X } from 'lucide-react';

type ToastType = ReturnType<typeof createToaster>[1];

const ToastContext = createContext<ToastType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    // It was not needed in the technical test, but I wanted to make a little toaster for success/error on adding actions to the queue
    const [Toaster, toast] = createToaster({
        placement: 'bottom-start',
        duration: 50000,
        render(toast) {
            const color = toast.title === 'Success' ? 'success' : 'error';
            const bgColor = toast.title === 'Success' ? 'background.success' : 'background.error';

            return (
                <Toast.Root
                    transition="opacity 220ms cubic-bezier(0.4, 0, 0.2, 1) 0s"
                    minW="28rem"
                    boxShadow="rgba(0, 0, 0, 0.05) 0px 3px 20px;"
                >
                    <HStack>
                        <styled.div bgColor={color} borderRadius="20px" h="3rem" w="4px"></styled.div>
                        <styled.div p="2" rounded="full" color={color} bgColor={bgColor}>
                            {toast.title === 'Success' ? <Check size="14px" /> : <X />}
                        </styled.div>
                        <styled.div>
                            <Toast.Title fontSize="xl" mb="1" color={color}>
                                {toast.title}
                            </Toast.Title>
                            <Toast.Description>{toast.description}</Toast.Description>
                        </styled.div>
                    </HStack>
                </Toast.Root>
            );
        },
    });
    return (
        <ToastContext.Provider value={toast}>
            {children}
            <Toaster />
        </ToastContext.Provider>
    );
};
