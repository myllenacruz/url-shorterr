import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import environment from '@configuration/environment';

/**
 * Configuration options for connecting to the PostgreSQL database.
 */
const dataSource: DataSourceOptions = {
    type: 'postgres',
    host: `${environment.DATABASE_HOST}`,
    port: environment.DATABASE_PORT,
    username: `${environment.DATABASE_USERNAME}`,
    password: `${environment.DATABASE_PASSWORD}`,
    database: `${environment.DATABASE_NAME}`,
	entities: ['dist/infrastructure/database/entities/**/*.entity.js'],
    migrations: ['dist/infrastructure/database/migrations/*.js'],
    synchronize: false
};

export default registerAs('typeorm', () => dataSource);
export const connectionSource = new DataSource(dataSource);
