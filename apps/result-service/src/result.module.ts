import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
// Load the dotenv dependency and call the config method on the imported object
require('dotenv').config();

// Log the Redis URL to verify it's being read correctly
console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);

@Module({
  imports: [HttpModule, 
    PrometheusModule.register(),
    ConfigModule.forRoot({
      envFilePath: '../../.env',
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
          }
        },
      },
    ]),],
  controllers: [ResultController],
  providers: [ResultService, {
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
    useValue: process.env.RESULT_COLLECTION || 'defaultCollection'
  }],
})
export class ResultServiceModule {}
