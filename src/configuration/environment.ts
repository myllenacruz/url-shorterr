import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Handles the loading of environment variables from .env files and provides a configuration environment object for the application.
 */
export default {
    NODE_ENV: get('NODE_ENV').required().asString(),
    PORT: get('PORT').required().asPortNumber()
};
