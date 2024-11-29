import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProgressService {
  constructor(@Inject('RABBITMQ_CLIENT') private readonly mbusClient: ClientProxy) { };

  getProgress(): string {
    return 'Here is the progress!';
  }
}
