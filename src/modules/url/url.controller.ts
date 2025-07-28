import { Body, Controller, Post, HttpStatus, HttpCode, Get } from '@nestjs/common';
import { CreateShortenUrlDto } from '@modules/url/dtos/create-shorten-url.dto';
import { ShortenUrlService } from '@modules/url/services/shorten-url.service';
import { UserRequest } from '@src/authentication/decorators/user-request.decorator';
import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';
import { Public } from '@src/authentication/decorators/public.decorator';
import { IUrlShortenResponse } from '@modules/url/interfaces/url-shorten-response.interface';
import { ListMyUrls, ShortenUrl } from '@modules/url/decorators/swagger-url.decorator';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { ListMyUrlsService } from '@modules/url/services/list-my-urls.service';

@Controller('url')
export class UrlController {
    constructor(
        private readonly shortenUrlService: ShortenUrlService,
        private readonly listMyUrlsService: ListMyUrlsService
    ) {}
    /**
     * Endpoint to short an URL.
     * @param {AuthenticationDto} data - The original url data to short.
     * @decorator {@link Public} - Marks the endpoint as publicly accessible, bypassing authentication checks.
     * @decorator {@link ShortenUrl} - Decorator to define Swagger documentation for shorten URL.
     * @returns {IUrlShortenResponse} An object containing originalUrl and shortUrl.
     */
    @Post()
    @Public()
    @ShortenUrl()
    @HttpCode(HttpStatus.CREATED)
    public async shorten(@Body() data: CreateShortenUrlDto, @UserRequest() userRequest: IUserRequest): Promise<IUrlShortenResponse> {
        const shorten = await this.shortenUrlService.execute(data, userRequest);
        return shorten;
    }

    /**
     * Endpoint to list user URL's.
     * @param {IUserRequest} userRequest - The user request data.
     * @decorator {@link ListMyUrls} - Decorator to define Swagger documentation for shorten URL.
     * @returns {IUrlShortenResponse} An object containing originalUrl and shortUrl.
     */
    @Get('my')
    @ListMyUrls()
    public async listMyUrls(@UserRequest() userRequest: IUserRequest): Promise<UrlEntity[]> {
        const urls = await this.listMyUrlsService.execute(userRequest);
        return urls;
    }
}
