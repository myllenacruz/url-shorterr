import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserRequest } from '../interfaces/user-request.interface';

/**
 * Custom param decorator to extract user information from the request.
 * This decorator is used to parse and extract the incoming user request and transform them into a structured object.
 * @param data - Additional data if needed (not used in this decorator).
 * @param ctx - The execution context.
 * @returns The IUserRequest containing user information extracted from the request.
 */
export const UserRequest = createParamDecorator((_data: unknown, ctx: ExecutionContext): IUserRequest => {
    const request = ctx.switchToHttp().getRequest();

    const { id, name, email } = request.user;
    request.user = { id, name, email };
    return request.user;
});
