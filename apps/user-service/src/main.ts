import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(UserServiceModule);
  // Connect RabbitMQ microservice
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.MBUS_URI],
      queue: 'User',
      queueOptions: {
        durable: false
      }
    }
  };
  
  // Connect microservice
  app.connectMicroservice(microserviceOptions);
  
  // Start both HTTP and microservice
  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3001);
  logger.log(`Application running on port ` + 3001);
}
bootstrap();
