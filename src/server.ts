/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database connected successfully');

    server = app.listen(config.port, () => {
      console.log(`Application is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Failed to connect database', error);
  }
}

bootstrap();

//handle unhandle rejection
process.on('unhandledRejection', error => {
  if (server) {
    server.close(() => {
      console.log(
        `😈 unahandledRejection is detected , shutting down ...`,
        error,
      );
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//handle uncaught exception
process.on('uncaughtException', error => {
  console.error(`😈 uncaughtException is detected , shutting down ...`, error);
  process.exit(1);
});

//handle signal termination
process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
