import { config } from 'dotenv';
config();

import express from 'express';
import http from 'http';
import { redisClient } from './clients/redisClient';
import { queueRouter } from './routes/queueRouter';
import { getQueueStatus, initializeQueue, refreshCredits, removeFirstAvailableAction } from './services/queueService';
import { initWebSocketServer, sendToWebSocket } from './services/websocketService';
import { QueueStatus } from './types/queueTypes';

const app = express();

app.use(express.json());
app.use(queueRouter);

const httpWss = http.createServer(app);
initWebSocketServer(httpWss);

httpWss.listen(8081, () => {
    console.log('WebSocket server listening on port 8081');
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    try {
        await redisClient.connect();
        const queueStatus = await getQueueStatus();

        // We need to create the queue if it doesn't exist
        if (!queueStatus) {
            await initializeQueue();
            console.log('Queue initialized');
        }
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        server.close();
    }
});

setInterval(async () => {
    const queueStatus = (await getQueueStatus()) as QueueStatus;

    const action = await removeFirstAvailableAction(queueStatus);
    if (action) {
        sendToWebSocket(JSON.stringify(queueStatus));
        console.log('Sent action to WebSocket');
    }
}, 120 * 1000);

setInterval(async () => {
    const queueStatus = (await getQueueStatus()) as QueueStatus;

    refreshCredits(queueStatus);
    sendToWebSocket(JSON.stringify(queueStatus));
}, 60 * 60 * 24 * 1000);

process.on('SIGINT', async () => {
    await redisClient.disconnect();
    server.close(() => {
        console.log('Server closed');
    });
});
