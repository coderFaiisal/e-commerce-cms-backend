/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

//handle uncaught exception
process.on('uncaughtException', error => {
  console.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database connect successfully');

    server = app.listen(config.port, () => {
      console.log(`Application is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Failed to connect database', error);
  }
  //handle unhandle rejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

//handle signal termination
process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
