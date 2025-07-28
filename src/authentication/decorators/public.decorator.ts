import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Metadata key to associate public routes.
 * @type {string}
 */
export const PUBLIC: string = 'public';

/**
 * Decorator to mark a route as publicly accessible, bypassing authorization checks.
 * Routes marked with this decorator do not require authorization and are accessible to all users.
 * Used in controllers to specify public endpoints.
 */
export const Public = (): CustomDecorator<string> => SetMetadata(PUBLIC, true);
