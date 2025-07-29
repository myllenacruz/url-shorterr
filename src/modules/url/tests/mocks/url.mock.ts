import { IUrlShortenResponse } from '@modules/url/interfaces/url-shorten-response.interface';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { userEntity } from '@modules/user/tests/mocks/user.mock';
import { CreateShortenUrlDto } from '../../dtos/create-shorten-url.dto';
import { UpdateUrlDto } from '@modules/url/dtos/update-short-url.dto';

export const urlEntityWithoutUser: Omit<UrlEntity, 'user'> = {
    id: '44ec7882-8a90-4f85-8d23-b785a10af925',
    shortCode: 'abf5d7',
    originalUrl: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    accessCount: 0,
    userId: userEntity.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
};

export const urlEntity: UrlEntity = {
    ...urlEntityWithoutUser,
    user: { ...userEntity }
};

export const shortenUrlResponse: IUrlShortenResponse = {
    originalUrl: urlEntity.originalUrl,
    shortUrl: `http://localhost/${urlEntity.shortCode}`
};

export const createShortenUrlDto: CreateShortenUrlDto = {
    url: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/'
};

export const updateUrlDto: UpdateUrlDto = {
    url: 'https://teddy360.com.br/material/another-long-url'
};
