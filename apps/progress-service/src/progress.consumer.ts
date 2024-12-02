import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProgressService } from './progress.service';


@Controller()
export class ProgressConsumer {
    private readonly logger = new Logger(ProgressConsumer.name);

    constructor(private readonly progressService: ProgressService) {}

    @EventPattern('ResultAdded')
    handleResultAddedEvent(@Payload() userid: any, @Payload() puzzleid: any) {
        try {
            this.logger.log('Result added on puzzle:', JSON.stringify(puzzleid));
            return this.progressService.deleteProgress(userid, puzzleid);
        } catch (error) {
            this.logger.error('Error processing result event', error);
            throw error;
        }
    }

    @EventPattern('UserRemoved')
    handleUserDeletedEvent(@Payload() userid: any) {
        try {
            this.logger.log('User deleted:', JSON.stringify(userid));
            return this.progressService.deleteProgressByUser(userid);
        } catch (error) {
            this.logger.error('Error processing result event', error);
            throw error;
        }
    }
}