import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PuzzleController } from './puzzle.controller';
import { PuzzleService } from './puzzle.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQProducerService } from './producer.service';
import { RabbitMQConsumerService } from './consumer.service';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { MongoClient, ServerApiVersion } from 'mongodb';

// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

// Log the Redis URL to verify it's being read correctly
console.log('Connecting to Redis at:', process.env.REDIS_URI);
console.log('Connecting to RabbitMQ at:', process.env.MBUS_URI);

@Module({
  imports: [HttpModule, 
    PrometheusModule.register(),
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL ,
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.MBUS_URI],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
          //noAck: false,                      // Enable message acknowledgements
        },
      },
    ]),
  ],
  controllers: [PuzzleController, RabbitMQConsumerService],
  providers: [PuzzleService,
    {
      provide: 'MONGO_CLIENT',
      useFactory: () => {
        return new MongoClient(process.env.MONGODB_URI || '', {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        });
      }
    },
    {
      provide: 'DATABASE_NAME',
      useValue: process.env.DATABASE || 'defaultDatabase'
    },
    {
      provide: 'COLLECTION_NAME',
      useValue: process.env.COLLECTION || 'defaultCollection'
    }, RabbitMQProducerService],
  exports: [RabbitMQProducerService],
})
export class PuzzleServiceModule {}
