import { DataSource } from 'typeorm';
import { User } from '@client-service/infra/orm/entities';
import { CONFIG } from '@client-service/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONFIG.DATABASE_HOST,
  port: CONFIG.DATABASE_PORT,
  username: CONFIG.DATABASE_USERNAME,
  password: CONFIG.DATABASE_PASSWORD,
  database: CONFIG.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
  ssl:
    CONFIG.NODE_ENV === 'development' || CONFIG.NODE_ENV === 'test'
      ? false
      : true,
  extra:
    CONFIG.NODE_ENV === 'development' || CONFIG.NODE_ENV === 'test'
      ? {}
      : {
          ssl: {
            rejectUnauthorized: false,
          },
        },
});
