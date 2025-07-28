import { Injectable } from '@nestjs/common';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { IUserRequest } from '@src/authentication/interfaces/user-request.interface';

@Injectable()
export class ListMyUrlsService {
    constructor(private readonly urlRepository: UrlRepository) {}

    /**
     * Executes the retrieval of all user urls.
     * @param {IUserRequest} userRequest - The user request data.
     * @returns {UrlEntity[]} - The URL entity data.
     */
    public async execute(userRequest: IUserRequest): Promise<UrlEntity[]> {
        const urls = await this.urlRepository.findAllByUserId(userRequest.id);
        return urls;
    }
}
