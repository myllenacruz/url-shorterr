import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { user } from '../tests/mocks/user.mock';

/**
 * Decorator to define Swagger documentation for creating a user.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function CreateUser(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiResponse({
            content: {
                'application/json': {
                    examples: {
                        data: { value: { ...user } }
                    }
                }
            },
            status: HttpStatus.CREATED
        }),
        ApiOperation({
            summary: 'Create a new user',
            description: `
                This endpoint is used to create a new user.
                It accepts data in the request body and returns the created user.
            `
        })
    );
}
