import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';

import { ENV } from './config/env';
import rootRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security headers with cross-origin resource policy allowed for local file downloads
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Explicitly configured CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ENV.CLIENT_URL,
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files for assignment documents & preview
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting on sensitive authentication routes (skipping preflight OPTIONS)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  skip: (req) => req.method === 'OPTIONS',
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Mount main API routes
app.use('/api', rootRouter);

// Global Error Handler
app.use(errorHandler);

// Start server if not imported by tests
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AcademiaERP Backend Server is running on port ${ENV.PORT}`);
    console.log(`📡 API Base:   http://localhost:${ENV.PORT}/api`);
    console.log(`🔒 Environment: ${ENV.NODE_ENV}`);
    console.log(`🤖 AI Service:  ${ENV.AI_SERVICE_URL}`);
    console.log(`====================================================`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${ENV.PORT} is already in use. Please terminate any process holding port ${ENV.PORT}.`);
    } else {
      console.error('Server error:', err);
    }
  });

  const handleShutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
  process.on('SIGUSR2', handleShutdown);
}

export default app;
