import { NestFactory } from '@nestjs/core';
import { PuzzleServiceModule } from './puzzle.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(PuzzleServiceModule);
  
  
  // Start both HTTP server and microservice
  //await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
