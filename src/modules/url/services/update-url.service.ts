import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { UpdateUrlDto } from '@modules/url/dtos/update-short-url.dto';

@Injectable()
export class UpdateUrlService {
    constructor(private readonly urlRepository: UrlRepository) {}

    /**
     * Updates the original url of an existing shortened URL.
     * Only the owner of the URL can perform this operation.
     * Public URLs cannot be edited by logged-in users.
     *
     * @param {string} shortCode - The short code of the URL to be updated.
     * @param {UpdatetUrlDto} data - The DTO containing the fields to be updated (currently only originalUrl).
     * @param {IUserRequest} userRequest The user making the request (used to verify ownership).
     * @returns {UrlEntity} The updated url entity data.
     * @throws {NotFoundException} If no URL is found for the given short code.
     * @throws {ConflictException} If the new URL is already used by another active URL owned by the same user.
     */
    public async execute(shortCode: string, data: UpdateUrlDto, userRequest: IUserRequest): Promise<UrlEntity> {
        const url = await this.urlRepository.findByShortCodeAndUserId(shortCode, userRequest.id);
        if (!url) throw new NotFoundException();

        const existingUrl = await this.urlRepository.findByOriginalUrlAndUserId(data.url, userRequest.id);
        if (existingUrl && existingUrl.id !== url.id) throw new ConflictException();
        url.originalUrl = data.url;

        const updatedUrl = await this.urlRepository.save(url);
        return updatedUrl;
    }
}
