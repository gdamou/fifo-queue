import { HStack, Stack, styled } from '../styled-system/jsx';
import { ActionList } from './components/ActionList';
import { QueueList } from './components/QueueList';
import { WS_URL } from './config';
import { useQueue } from './context/QueueContext';
import { useCustomWebSocket } from './hooks/useCustomWebSocket';

function App() {
    const { connectionStatus } = useCustomWebSocket(WS_URL);
    const { queueStatus } = useQueue(); // If the application scales, we wont pass the queueStatus to the ActionList and QueueList components, but instead we will use the useQueue hook inside those components

    return (
        <Stack py="16" alignItems="center" justifyContent="start" w="100vw" h="100vh" bg="background.primary">
            Socket {connectionStatus === 'Open' ? '🟢' : connectionStatus === 'Connecting' ? '🟡' : '🔴'}
            {queueStatus && (
                <HStack
                    bg="background.secondary"
                    alignItems="flex-start"
                    border="2px solid white"
                    borderRadius="20px"
                    p="4"
                    w="3/4"
                    gap="7"
                    h="full"
                >
                    <ActionList details={queueStatus.details} />
                    <styled.div h="full" w="1px" border="1px solid" borderColor="background.separation" />
                    <QueueList queue={queueStatus.queue} />
                </HStack>
            )}
        </Stack>
    );
}

export default App;
