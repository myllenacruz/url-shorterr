import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { shortenUrlResponse, urlEntityWithoutUser } from '@modules/url/tests/mocks/url.mock';

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

/**
 * Decorator to define Swagger documentation for list a user URL's.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function ListMyUrls(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiResponse({
            content: {
                'application/json': {
                    examples: {
                        data: { value: { ...urlEntityWithoutUser } }
                    }
                }
            },
            status: HttpStatus.OK
        }),
        ApiOperation({
            summary: "List user URL's",
            description: `
                This endpoint is used to list user URL's.
            `
        })
    );
}

/**
 * Decorator to define Swagger documentation for updating a user's URL.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function UpdateUrl(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiResponse({
            status: HttpStatus.OK,
            content: {
                'application/json': {
                    examples: {
                        data: { value: { ...urlEntityWithoutUser } }
                    }
                }
            }
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Short code not found.'
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'User does not have permission to update this URL.'
        }),
        ApiResponse({
            status: HttpStatus.CONFLICT,
            description: 'Another URL with the same destination already exists for this user.'
        }),
        ApiOperation({
            summary: 'Update a shortened URL',
            description: `
                This endpoint allows a user to update the original URL associated with a short code.
                Only the owner of the URL can perform this operation.
            `
        })
    );
}

/**
 * Decorator to define Swagger documentation for redirecting to the original URL.
 * @returns {MethodDecorator} Method decorator for applying Swagger metadata.
 */
export function RedirectTo(): MethodDecorator {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.FOUND,
            description: 'Redirects to the original URL corresponding to the provided short code.',
        }),
        ApiOperation({
            summary: 'Redirect to original URL',
            description: `
                This endpoint receives a short code and redirects the user to the original URL.
            `
        })
    );
}