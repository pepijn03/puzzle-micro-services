import { NestFactory } from '@nestjs/core';
import { ProgressServiceModule } from './progress.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(ProgressServiceModule);
  // Connect RabbitMQ microservice
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.MBUS_URI],
      queue: 'progress',
      queueOptions: {
        durable: false
      }
    }
  };
  
  // Connect microservice
  app.connectMicroservice(microserviceOptions);
  
  // Start both HTTP and microservice
  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3002);
  logger.log(`Application running on port ` + 3002);
}
bootstrap();