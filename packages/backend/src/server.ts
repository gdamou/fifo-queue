import { config } from 'dotenv';
config();

import http from 'http';
import app from './app';
import { redisClient } from './clients/redisClient';
import { getQueueStatus, initializeQueue, refreshCredits, removeFirstAvailableAction } from './services/queueService';
import { initWebSocketServer, sendToWebSocket } from './services/websocketService';
import { QueueStatus } from './types/queueTypes';
// import { QUEUE_NAME } from './constants/queueConstants';

const httpWss = http.createServer(app);
initWebSocketServer(httpWss);

httpWss.listen(8081, () => {
    console.log('✅ WebSocket server listening on port 8081');
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, async () => {
    console.log(`✅ Server is listening on port ${PORT}`);
    try {
        await redisClient.connect();
        const queueStatus = await getQueueStatus();

        // We need to create the queue if it doesn't exist
        if (!queueStatus) {
            await initializeQueue();
            console.log('✅ Queue initialized');
        }
        console.log('✅ Connected to Redis');
        // // clear redis queue
        // await redisClient.del(QUEUE_NAME);
    } catch (err) {
        console.error('❌ Failed to connect to Redis:', err);
        server.close();
    }
});

// Every 2 minutes, we check if there is an action that can be removed from the queue
setInterval(async () => {
    const queueStatus = (await getQueueStatus()) as QueueStatus;

    const action = await removeFirstAvailableAction(queueStatus);
    if (action) {
        sendToWebSocket(JSON.stringify(queueStatus));
        console.log('✅ Sent action to WebSocket');
    }
}, 120 * 1000);

// Every 24 hours, we refresh the credits
setInterval(async () => {
    const queueStatus = (await getQueueStatus()) as QueueStatus;

    refreshCredits(queueStatus);
    sendToWebSocket(JSON.stringify(queueStatus));
}, 60 * 60 * 24 * 1000);

process.on('SIGINT', async () => {
    await redisClient.disconnect();
    server.close(() => {
        console.log('✅ Server closed');
    });
});
