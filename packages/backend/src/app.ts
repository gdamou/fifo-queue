import express from 'express';
import { queueRouter } from './routes/queueRouter';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/queue', queueRouter);

export default app;
