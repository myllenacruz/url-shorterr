import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';

@Injectable()
export class DeleteUrlService {
    constructor(private readonly urlRepository: UrlRepository) {}

    /**
     * Deletes a short URL owned by a specific user.
     * @param {string} shortCode The short code of the URL to delete.
     * @param {IUserRequest} userRequest The authenticated user's request object, containing userId.
     * @throws {NotFoundException} if the URL with the given short code does not exist.
     * @returns A promise that resolves when the URL is deleted.
     */
    public async execute(shortCode: string, userRequest: IUserRequest): Promise<void> {
        const url = await this.urlRepository.findByShortCodeAndUserId(shortCode, userRequest.id);
        if (!url) throw new NotFoundException();
        await this.urlRepository.softDelete(url.id);
    }
}
