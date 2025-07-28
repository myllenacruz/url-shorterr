import { IJwtPayload } from './jwt-payload.interface';

/**
 * Represents the request data of a user.
 * Extends the IJwtPayload interface and includes 'name' and 'email' fields from it.
 * Additionally, it contains the 'id' field specific to the user request, where 'id' corresponds to the 'sub' property of IJwtPayload.
 */
export interface IUserRequest extends Pick<IJwtPayload, 'name' | 'email'> {
    id: string;
}
