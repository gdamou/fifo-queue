import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueueProvider } from './context/QueueContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ToastProvider>
            <QueueProvider>
                <App />
            </QueueProvider>
        </ToastProvider>
    </React.StrictMode>
);
