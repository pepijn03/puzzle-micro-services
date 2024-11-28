import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  ssl: {
    rejectUnauthorized: false, // Use with caution, preferably use proper SSL certificates
    ca: configService.get<string>('DB_CA_CERT') // Optional: if you need to provide a CA certificate
  },
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production', // Be careful with this in production
  logging: process.env.NODE_ENV !== 'production'
});