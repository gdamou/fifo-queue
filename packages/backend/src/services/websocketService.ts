import { WebSocketServer } from 'ws';

let wss: WebSocketServer;

export const initWebSocketServer = (httpWss: any) => {
    wss = new WebSocketServer({ server: httpWss });
};

export const sendToWebSocket = (message: string) => {
    // Since we are using a single instance of the WebSocket server, we can use the wss.clients property to get all connected clients and send them a message.
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
