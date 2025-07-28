import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import environment from '@configuration/environment';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { IJwt } from '../interfaces/jwt.interface';

/**
 * Strategy that uses JWT token provided by Auth0 for authentication.
 * Extracts the token from the Authorization Header and validates it.
 */
@Injectable()
export class AuthenticationStrategy extends PassportStrategy(Strategy, 'jwt') {
    /**
     * Instance of the AuthenticationStrategy using Passport.
     * It sets up the necessary options for Auth0 JWT verification.
     * @constructor
     */
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: environment.AUTHENCATION_SECRET
        });
    }

    /**
     * Validates the payload extracted from the JWT token.
     * This method is invoked by Passport during the request process.
     * It should return object based on the provided payload.
     * @param {IJwtPayload} payload - The payload extracted from the JWT token.
     * @returns {IJwtPayload} The user object based on the provided payload.
     */
    public validate(payload: IJwtPayload): IJwt {
        return {
            id: payload.sub,
            name: payload.name,
            email: payload.email
        };
    }
}
