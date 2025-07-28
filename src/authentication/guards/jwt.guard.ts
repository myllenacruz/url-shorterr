
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC } from '../decorators/public.decorator';

/**
 * This guard is essential for enabling authentication-based authorization guards.
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    /**
     * Determines if the route can be activated.
     * @param {ExecutionContext} context - Execution context containing information about the request.
     */
    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        const canActivate = super.canActivate(context);
        if (typeof canActivate === 'boolean') return canActivate;

        const canActivatePromise = canActivate as Promise<boolean>;
        return canActivatePromise.catch(() => {
            throw new UnauthorizedException();
        });
    }
}