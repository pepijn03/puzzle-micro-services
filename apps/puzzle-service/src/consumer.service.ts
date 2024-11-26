// rabbitmq-consumer.service.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitMQConsumerService {
  @MessagePattern('my_pattern')
  async handleMessage(@Payload() data: any) {
    console.log('Received message:', data);
    // Handle the message here
  }
}
