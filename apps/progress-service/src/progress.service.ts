import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgressService {
  getProgress(): string {
    return 'Here is the progress!';
  }
}
