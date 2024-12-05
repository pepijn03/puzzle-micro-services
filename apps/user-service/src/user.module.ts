import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { UserEntity } from '../objects/user.entity'; // We'll create this
import { FriendEntity } from '../objects/friend.entity'; // We'll create this
import { getDatabaseConfig } from '../database.config';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ConfigModule.forRoot(), // For environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([UserEntity, FriendEntity]), // Register entities
    PrometheusModule.register(),
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
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserServiceModule {}