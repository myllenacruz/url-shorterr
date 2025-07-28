import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Decorator to define Swagger documentation for authentication.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function Authentication(): MethodDecorator {
    return applyDecorators(
        ApiResponse({
            content: {
                'application/json': {
                    examples: {
                        data: { value: { acessToken: 'myAcessToken' } }
                    }
                }
            },
            status: HttpStatus.CREATED
        }),
        ApiOperation({
            summary: 'authentication',
            description: `
						This endpoint is used to authentication.
						It accepts email and password in the request body and returns the access token.
					`
        })
    );
}
