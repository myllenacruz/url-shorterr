import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { shortenUrlResponse } from '@modules/url/tests/mocks/url.mock';

/**
 * Decorator to define Swagger documentation for creating a shorten URL.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function ShortenUrl(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiResponse({
            content: {
                'application/json': {
                    examples: {
                        data: { value: { ...shortenUrlResponse } }
                    }
                }
            },
            status: HttpStatus.CREATED
        }),
        ApiOperation({
            summary: 'Create shorten URL',
            description: `
				This endpoint is used to create a short URL.
				It accepts data in the request body and returns the original and short URL.
			`
        })
    );
}
