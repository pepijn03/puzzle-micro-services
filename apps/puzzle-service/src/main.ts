import { NestFactory } from '@nestjs/core';
import { PuzzleServiceModule } from './puzzle.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import path from 'path';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(PuzzleServiceModule);
  // Configure RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
     transport: Transport.RMQ,
     options: {
       urls: [process.env.MBUS_URI],     // RabbitMQ connection URL
       queue: 'main_queue',              // The queue you want to connect to
       queueOptions: {
         durable: false,                 // Durable queues persist across restarts
       },
       noAck: false,                      // Enable message acknowledgements
     },
   });
  
  // Start both HTTP server and microservice
  //await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
