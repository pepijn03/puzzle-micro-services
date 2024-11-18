// rabbitmq-producer.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQProducerService {
  constructor(@Inject('RABBITMQ_CLIENT') private client: ClientProxy) {}

  async sendMessage(pattern: string, message: any) {
    console.log('Sending message:', message);
    return await this.client.send(pattern, message).toPromise();
  }
}
