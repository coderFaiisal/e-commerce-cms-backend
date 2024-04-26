/* eslint-disable no-unused-expressions */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { Scheduler } from './app/scheduler';

const app: Application = express();

//middlewares
app.use(
  cors({
    origin: [
      'https://timeless-jewellery-admin.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

//handling global error
app.use(globalErrorHandler);

// schedule task
Scheduler;

//handle not found url
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
