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
        ApiOperation({
            summary: 'Create a shortened URL',
            description: `
                This endpoint creates a shortened URL from the provided original URL.
                If the URL already exists, it returns the existing short URL.
                Otherwise, it generates a new short code and stores the shortened URL.
            `
        }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Shortened URL successfully created',
            content: {
                'application/json': {
                    examples: {
                        success: {
                            summary: 'Successful Response',
                            value: { ...shortenUrlResponse }
                        }
                    }
                }
            }
        }),
        ApiResponse({
            status: HttpStatus.CONFLICT,
            description: 'The client should try the request again, with a different URL or after some time.'
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'The authenticated user does not exist in the system. Ensure the user exists and try again.'
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
        ApiBearerAuth(),
        ApiResponse({
            status: HttpStatus.FOUND,
            description: 'Redirects to the original URL corresponding to the provided short code.'
        }),
        ApiOperation({
            summary: 'Redirect to original URL',
            description: `
                This endpoint receives a short code and redirects the user to the original URL.
            `
        })
    );
}
