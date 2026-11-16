import 'dotenv/config';
import express from 'express';
import { parse } from 'node:querystring';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from './server.js';
import userRouter from './routes/userRoutes.js';
import moodRouter from './routes/moodRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import compression from 'compression';
import cors from 'cors';
import { validateEmailConfiguration } from './utils/email.js';
import swaggerUi from 'swagger-ui-express';
import openApiSpec from './docs/openapi.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', fileURLToPath(new URL('./views/', import.meta.url)));

const port = process.env.PORT || 3000;
const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));

app.set('query parser', (queryString) =>
  ExpressMongoSanitize.sanitize(parse(queryString)),
);

// MIDDLEWARE
// CORS: allow the front-end origin (CLIENT_URL, a single URL also used for email links)
// plus any extra origins in CORS_ORIGINS (comma-separated, e.g. preview deploys or localhost).
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS || '').split(','),
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173');
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, Postman, server-to-server) with no Origin header
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);

// Security HTTP headers
app.use(helmet());

if (process.env.NODE_EVN === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use(express.json());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Sanitize request data in place; Express 5 exposes req.query as read-only.
app.use((req, res, next) => {
  for (const key of ['body', 'params', 'headers']) {
    if (req[key]) ExpressMongoSanitize.sanitize(req[key]);
  }
  next();
});

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'sort',
      'page',
      'limit',
      'fields',
      'date',
      'entryDate',
      'mood',
      'sleepHours',
      'feelings',
    ],
  }),
);

app.use('/img/users', express.static(path.join(publicDirectory, 'img/users')));

app.use('/api', limiter);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use(compression());

// ROUTES
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get('/', (req, res) => {
  res.status(200).render('base');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/moods', moodRouter);

// GLOBAL 404 HANDLER
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    validateEmailConfiguration();
  }

  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
