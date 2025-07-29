import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Decorator to define Swagger documentation for authentication.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function Authentication(): MethodDecorator {
    return applyDecorators(
        ApiOperation({
            summary: 'Authenticate user',
            description: `
                Authenticates a user using email and password.
                If the credentials are valid, returns a JWT access token which can be used in subsequent requests for authorization.
				The token is signed and contains the user ID (sub), name, and email.
            `
        }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Authentication successful. Returns a valid JWT access token.',
            content: {
                'application/json': {
                    examples: {
                        success: {
                            summary: 'Successful authentication',
                            value: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                        }
                    }
                }
            }
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Authentication failed. Invalid email or password.'
        })
    );
}