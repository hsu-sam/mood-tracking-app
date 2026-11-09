import 'dotenv/config';
import express from 'express';
import connectDB from './server.js';
import userRouter from './routes/userRoutes.js';
import moodRouter from './routes/moodRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

const app = express();

const port = process.env.PORT || 3000;

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

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

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

app.use('/api', limiter);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/moods', moodRouter);

// GLOBAL 404 HANDLER
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exitCode = 1;
});
