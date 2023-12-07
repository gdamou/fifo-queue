import { WebSocket, WebSocketServer } from 'ws';
import { getQueueStatus } from './queueService';

let wss: WebSocketServer;

export const initWebSocketServer = (httpWss: any) => {
    wss = new WebSocketServer({ server: httpWss });

    wss.on('connection', async (ws) => {
        // Fetch the current queue status
        const queueStatus = await getQueueStatus();

        // Convert the queue status to a string (e.g., JSON) if it's not already
        const queueStatusString = JSON.stringify(queueStatus);

        // Send the queue status to the connected client
        ws.send(queueStatusString);
    });
};

export const sendToWebSocket = (message: string) => {
    // Since we are using a single instance of the WebSocket server, we can use the wss.clients property to get all connected clients and send them a message.
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
