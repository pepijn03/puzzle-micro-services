import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Puzzle } from '../objects/puzzle.interface';

@Controller()
export class PuzzleConsumer {
    private readonly logger = new Logger(PuzzleConsumer.name);

    @EventPattern('puzzle_created')
    handlePuzzleCreatedEvent(@Payload() puzzle: Puzzle) {
        try {
            console.log('Received puzzle:', JSON.stringify(puzzle));
            return puzzle; // Ensure you return something
        } catch (error) {
            console.error('Error processing puzzle event', error);
            throw error;
        }
    }
}