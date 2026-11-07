import 'dotenv/config';
import express from 'express';
import connectDB from './server.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';

const app = express();

const port = process.env.PORT || 3000;

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
// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use('/api/v1/users', userRouter);

// GLOBAL 404 HANDLER
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
