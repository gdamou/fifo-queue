import express from 'express';
import { queueRouter } from './routes/queueRouter';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/queue', queueRouter);

export default app;
