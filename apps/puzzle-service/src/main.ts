import { NestFactory } from '@nestjs/core';
import { PuzzleServiceModule } from './puzzle.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(PuzzleServiceModule);
  
  
  // Start both HTTP server and microservice
  //await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3003);
  logger.log(`Application running on port ` + 3003);
}
bootstrap();
