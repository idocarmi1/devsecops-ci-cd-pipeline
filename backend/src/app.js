import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { analyzeIncident, validateIncidentText } from './incidentAnalyzer.js';

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

app.post('/api/analyze-incident', (request, response, next) => {
  try {
    const validationError = validateIncidentText(request.body?.incidentText);

    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }

    response.json(analyzeIncident(request.body.incidentText));
  } catch (error) {
    next(error);
  }
});

app.use((_request, response) => {
  response.status(404).json({
    error: 'Not found',
  });
});

app.use((error, _request, response, next) => {
  void next;
  console.error('API error:', error);
  const statusCode = error.status || error.statusCode || 500;

  response.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : 'Invalid request',
  });
});

export default app;
