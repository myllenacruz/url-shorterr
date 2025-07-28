import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { generateShortCode } from '@modules/url/utils/generate-short-code';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { CreateShortenUrlDto } from '@modules/url/dtos/create-shorten-url.dto';
import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';
import environment from '@configuration/environment';
import { IUrlShortenResponse } from '@modules/url/interfaces/url-shorten-response.interface';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';

@Injectable()
export class ShortenUrlService {
    constructor(
        private readonly urlRepository: UrlRepository,
        private userRepository: UserRepository
    ) {}
    /**
     * Creates a shortened URL or returns an existing one if already registered.
     * @param {CreateShortenUrlDto} data - Data containing the original URL to be shortened.
     * @param {IUserRequest} userRequest - Authenticated user's request information.
     * @returns The original URL and the corresponding shortened URL.
     * @throws ConflictException - If short code cannot be generated.
     */
    public async execute(data: CreateShortenUrlDto, userRequest: IUserRequest): Promise<IUrlShortenResponse> {
        if (userRequest?.id) {
            const existingUser = await this.userRepository.findById(userRequest.id);
            if (!existingUser) throw new NotFoundException();
        }

        const existingShortenedUrl: UrlEntity = await this.urlRepository.findByOriginalUrl(data.url);
        if (existingShortenedUrl) {
            const shortUrl = `${environment.BASE_URL}/${existingShortenedUrl.shortCode}`;
            return {
                originalUrl: existingShortenedUrl.originalUrl,
                shortUrl: shortUrl
            };
        }

        const shortCode: string = generateShortCode(environment.SHORT_CODE_LENGTH);
        const existingShortCode: UrlEntity = await this.urlRepository.findByShortCode(shortCode);
        if (existingShortCode) throw new ConflictException('Could not generate a unique short code. Please try again.');

        const newUrl: UrlEntity = await this.urlRepository.create({
            originalUrl: data.url,
            shortCode,
            userId: userRequest?.id,
            accessCount: 0
        });

        const shortUrl: string = `${environment.BASE_URL}/${newUrl.shortCode}`;
        return {
            originalUrl: newUrl.originalUrl,
            shortUrl: shortUrl
        };
    }
}
