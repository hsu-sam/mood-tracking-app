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
import { validateEmailConfiguration } from './utils/email.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', fileURLToPath(new URL('./views/', import.meta.url)));

const port = process.env.PORT || 3000;
const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));

app.set('query parser', (queryString) =>
  ExpressMongoSanitize.sanitize(parse(queryString)),
);

// MIDDLEWARE
// Security HTTP headers
app.use(helmet());

if (process.env.NODE_EVN === 'developement') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
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
  process.exitCode = 1;
});
