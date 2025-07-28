/**
 * Represents the payload extracted from JWT.
 * This interface defines the structure of the JWT payload object.
 */
export interface IJwtPayload {
    exp: number;
    iat: number;
    sub: string;
    name: string;
    email: string;
}
