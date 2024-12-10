import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { ProgressConsumer } from './progress.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [PrometheusModule.register(),
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
  controllers: [ProgressController],
  providers: [ProgressService, ProgressConsumer],
})
export class ProgressServiceModule {}
