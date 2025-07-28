import { Body, Controller, Post, HttpStatus, HttpCode, Get, Redirect, Param, Patch, UseGuards } from '@nestjs/common';
import { CreateShortenUrlDto } from '@modules/url/dtos/create-shorten-url.dto';
import { ShortenUrlService } from '@modules/url/services/shorten-url.service';
import { UserRequest } from '@src/authentication/decorators/user-request.decorator';
import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';
import { Public } from '@src/authentication/decorators/public.decorator';
import { IUrlShortenResponse } from '@modules/url/interfaces/url-shorten-response.interface';
import { RedirectUrlService } from '@modules/url/services/redirect-url.service';
import { ListMyUrls, RedirectTo, ShortenUrl, UpdateUrl } from '@modules/url/decorators/swagger-url.decorator';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { ListMyUrlsService } from '@modules/url/services/list-my-urls.service';
import { UpdateUrlDto } from '@modules/url/dtos/update-short-url.dto';
import { UpdateUrlService } from '@modules/url/services/update-url.service';
import { OptionalAuthenticationGuard } from '@src/authentication/guards/optional-authentication.guard';
import { IRedirectUrlResponse } from '@modules/url/interfaces/redirect-url-response.interface';

@Controller('url')
export class UrlController {
    constructor(
        private readonly shortenUrlService: ShortenUrlService,
        private readonly listMyUrlsService: ListMyUrlsService,
        private readonly updateUrlService: UpdateUrlService,
        private readonly redirectUrlService: RedirectUrlService
    ) {}
    /**
     * Endpoint to short an URL.
     * @param {AuthenticationDto} data - The original url data to short.
     * @decorator {@link ShortenUrl} - Decorator to define Swagger documentation for shorten URL.
     * @returns {IUrlShortenResponse} An object containing originalUrl and shortUrl.
     */
    @Post()
    @Public()
    @UseGuards(OptionalAuthenticationGuard)
    @ShortenUrl()
    @HttpCode(HttpStatus.CREATED)
    public async shorten(@Body() data: CreateShortenUrlDto, @UserRequest() userRequest: IUserRequest): Promise<IUrlShortenResponse> {
        const shorten = await this.shortenUrlService.execute(data, userRequest);
        return shorten;
    }

    /**
     * Endpoint to list user URL's.
     * @param {IUserRequest} userRequest - The authenticated user making the request.
     * @decorator {@link ListMyUrls} - Decorator to define Swagger documentation for shorten URL.
     * @returns {IUrlShortenResponse} An object containing originalUrl and shortUrl.
     */
    @Get('my')
    @ListMyUrls()
    public async listMyUrls(@UserRequest() userRequest: IUserRequest): Promise<UrlEntity[]> {
        const urls = await this.listMyUrlsService.execute(userRequest);
        return urls;
    }

    /**
     * Endpoint to updates the original url of a shortened URL.
     * @param {string} shortCode - The short code of the URL to be updated.
     * @param {UpdateUrlDto} data - The original URL to update.
     * @param {IUserRequest} userRequest - The authenticated user making the request.
     * @decorator {@link UpdateUrl} - Decorator to define Swagger documentation for update URL.
     * @returns {UrlEntity} The updated URL entity.
     */
    @Patch(':shortCode')
    @UpdateUrl()
    @HttpCode(HttpStatus.CREATED)
    public async update(@Param('shortCode') shortCode: string, @Body() data: UpdateUrlDto, @UserRequest() userRequest: IUserRequest): Promise<UrlEntity> {
        const updatedUrl = await this.updateUrlService.execute(shortCode, data, userRequest);
        return updatedUrl;
    }

    /**
     * Endpoint redirects to the original URL based on the provided short code.
     * @param {string} shortCode - The short code representing the shortened URL.
     * @decorator {@link RedirectTo} - Swagger decorator for documenting the redirect endpoint.
     * @returns {IRedirectUrlResponse} An object with a `url` property to which the user is redirected.
     */
    @Get(':shortCode')
    @Public()
    @Redirect()
    @RedirectTo()
    public async redirectToOriginal(@Param('shortCode') shortCode: string): Promise<IRedirectUrlResponse> {
        const originalUrl = await this.redirectUrlService.execute(shortCode);
        return { url: originalUrl };
    }
}
