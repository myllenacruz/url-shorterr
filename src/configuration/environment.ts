import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Handles the loading of environment variables from .env files and provides a configuration environment object for the application.
 */
export default {
    NODE_ENV: get('NODE_ENV').required().asString(),
    PORT: get('PORT').required().asPortNumber(),
    DATABASE_HOST: get('DATABASE_HOST').required().asString(),
    DATABASE_PORT: get('DATABASE_PORT').required().asInt(),
    DATABASE_USERNAME: get('DATABASE_USERNAME').required().asString(),
    DATABASE_PASSWORD: get('DATABASE_PASSWORD').required().asString(),
    DATABASE_NAME: get('DATABASE_NAME').required().asString(),
    DATABASE_CONNECTION_NAME: get('DATABASE_CONNECTION_NAME').required().asString(),
    DATABASE_SYNCHRONIZE: get('DATABASE_SYNCHRONIZE').required().asBool(),
    AUTHENCATION_SALTH: get('AUTHENCATION_SALTH').required().asInt()
};
