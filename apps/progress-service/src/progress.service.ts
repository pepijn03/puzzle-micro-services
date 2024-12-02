import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProgressService {
  constructor(@Inject('RABBITMQ_CLIENT') private readonly mbusClient: ClientProxy) { };

  getProgress(): string {
    return 'Here is the progress!';
  }

  deleteProgress(userid: number, puzzleid: number): string {
    return 'Progress deleted!';
  }

  deleteProgressByUser(userid: number): string {
    return 'Progress of user deleted!';
  }
}
