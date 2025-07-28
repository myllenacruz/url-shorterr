import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { IUserAuthenticate } from './interfaces/user-authenticate.interface';
import { AuthenticationDto } from './dtos/authentication.dto';
import { Authentication } from './decorators/swagger-authentication.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}
    /**
     * Endpoint to authentication by verifying credentials and generating a JWT token.
     * @param {AuthenticationDto} data - The user credentials for authentication.
     * @decorator {@link Public} - Marks the endpoint as publicly accessible, bypassing authentication checks.
     * @decorator {@link Authentication} - Decorator to define Swagger documentation for the authentication.
     * @returns {IAuthenticate} An object containing the access token.
     */
    @Post()
    @Public()
    @Authentication()
    @HttpCode(HttpStatus.OK)
    auth(@Body() data: AuthenticationDto): Promise<IUserAuthenticate> {
        return this.authenticationService.execute(data);
    }
}
