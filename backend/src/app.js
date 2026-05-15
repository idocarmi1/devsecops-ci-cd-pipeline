import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Security and platform middleware expected in a production-style Express API.
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
  }),
);
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    service: 'portfolio-devsecops-api',
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/message', (_request, response) => {
  response.json({
    message: 'DevSecOps portfolio API is running.',
    ownerProfile: 'Business Administration & Information Systems student',
    focusAreas: ['Networking fundamentals', 'CI/CD automation', 'AWS infrastructure'],
  });
});

app.use((_request, response) => {
  response.status(404).json({
    error: 'Not found',
  });
});

export default app;

