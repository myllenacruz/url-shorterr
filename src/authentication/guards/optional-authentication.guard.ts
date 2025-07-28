import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard allows a route to be accessible without mandatory authentication, but still attempts to extract and validate a JWT token if provided.
 * If a valid token is found, user information is populated in request.user.
 * Otherwise, the request proceeds without an authenticated user.
 */
@Injectable()
export class OptionalAuthenticationGuard extends AuthGuard('jwt') {
    /**
     * Overrides the default handleRequest method of AuthGuard to allow optional authentication.
     * @param {unknown} err - Error object if the strategy failed.
     * @param {TUser | null} user - User object returned by the strategy.
     * @param {unknown} info - Additional information about the authentication result.
     * @param {ExecutionContext} context - Execution context of the request.
     * @returns {any} The user object if successfully authenticated, or null otherwise.
     */
    public handleRequest<TUser = unknown>(err: unknown, user: TUser | null, info: unknown, context: ExecutionContext): TUser | null {
        if (err || !user) return null;
        return user;
    }

    /**
     * Determines if the route can be activated.
     * For this guard, it will always attempt to process authentication.
     * @param {ExecutionContext} context - Execution context.
     * @returns {Promise<boolean> | boolean} True if authentication is attempted.
     */
    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        const canActivate = super.canActivate(context);
        if (typeof canActivate === 'boolean') return canActivate;

        const canActivatePromise = canActivate as Promise<boolean>;
        return canActivatePromise;
    }
}
