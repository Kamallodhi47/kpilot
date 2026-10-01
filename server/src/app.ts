import express from 'express';
import cors from 'cors';
import campaignRoutes from './routes/campaignRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running, MVC architecture active.' });
});

// Mount Routes
app.use('/api/campaigns', campaignRoutes);

export default app;
