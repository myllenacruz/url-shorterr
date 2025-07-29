import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, HttpException } from '@nestjs/common';

/**
 * Custom exception filter to handle all HTTP exceptions.
 * @class
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    /**
     * If the exception is an HttpException, it extracts the status and response from the exception and sends them as the HTTP response.
     * If the exception is not an HttpException, it returns a internal server error response.
     * @param {Error} exception - The HTTP-related exception that occurred.
     * @param {ArgumentsHost} host - ArgumentsHost object containing details of the request context.
     * @returns {void}
     */
    catch(exception: Error, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const httpResponse = context.getResponse();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            return httpResponse.status(status).json(response);
        }

        return httpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception.message ? exception.message : 'Internal Server Error'
        });
    }
}
