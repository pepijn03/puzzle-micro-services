import { Injectable, Inject } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { ClientProxy } from '@nestjs/microservices';
import { Result } from '../objects/result.interface';

@Injectable()
export class ResultService {
  private readonly collection: any;

    constructor(
        @Inject('RABBITMQ_CLIENT') private readonly mbusClient: ClientProxy,
        @Inject('MONGO_CLIENT') private readonly mongoClient: MongoClient,
        @Inject('DATABASE_NAME') private readonly databaseName: string,
        @Inject('COLLECTION_NAME') private readonly collectionName: string
    ) {
        this.collection = this.mongoClient.db(this.databaseName).collection(this.collectionName);
    }

    async getAllResults(): Promise<Result[]> {
        await this.mongoClient.connect();
        const res = await this.collection
            .find()
            .toArray() as Result[];
        return res;
    }

    async getResultsByPuzzle(puzzleId: string): Promise<Result[]> {
        await this.mongoClient.connect();
        const res = await this.collection
            .find({ puzzleId: puzzleId })
            .toArray() as Result[];
        return res;
    }

    async getResultByUser(userName: string): Promise<Result[]> {
      await this.mongoClient.connect();
      const res = await this.collection
          .find({ userName: userName })
          .toArray() as Result[];
      return res;
    }

    async addResult(result: Result): Promise<void> {
        await this.mongoClient.connect();
        await this.collection.insertOne(result);
        console.debug('Result added to database!');
        this.publishResultEvent(result);
    }

    // Example method to publish a message
    async publishResultEvent(result: Result) {
        return this.mbusClient.emit('result_created', result);
    }
}
