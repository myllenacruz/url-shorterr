import { Test, TestingModule } from '@nestjs/testing';
import { ShortenUrlService } from '@modules/url/services/shorten-url.service';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { ConflictException } from '@nestjs/common';
import { createShortenUrlDto, urlEntity } from './mocks/url.mock';
import { userRequest } from '@src/authentication/tests/mocks/user-request.mock';
import * as shortCodeUtil from '@modules/url/utils/generate-short-code';
import environment from '@configuration/environment';

describe('ShortenUrlService', () => {
    let service: ShortenUrlService;
    let urlRepository: UrlRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShortenUrlService,
                {
                    provide: UrlRepository,
                    useValue: {
                        findByOriginalUrl: jest.fn(),
                        findByShortCode: jest.fn(),
                        create: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<ShortenUrlService>(ShortenUrlService);
        urlRepository = module.get(UrlRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        it('should return existing shortened URL if original URL already exists', async () => {
            jest.spyOn(urlRepository, 'findByOriginalUrl').mockResolvedValueOnce(urlEntity);
            const result = await service.execute(createShortenUrlDto, userRequest);

            expect(result.originalUrl).toBe(urlEntity.originalUrl);
            expect(result.shortUrl).toBe(`${environment.BASE_URL}/${urlEntity.shortCode}`);
            expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(createShortenUrlDto.url);
            expect(urlRepository.findByShortCode).not.toHaveBeenCalled();
            expect(urlRepository.create).not.toHaveBeenCalled();
        });

        it('should create and return a new shortened URL if original URL does not exist', async () => {
            jest.spyOn(urlRepository, 'findByOriginalUrl').mockResolvedValueOnce(null);
            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce(null);

            const shortCode = '123456';
            jest.spyOn(shortCodeUtil, 'generateShortCode').mockReturnValue(shortCode);
            jest.spyOn(urlRepository, 'create').mockResolvedValueOnce({ ...urlEntity, shortCode: shortCode });

            const result = await service.execute(createShortenUrlDto, userRequest);
            expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(createShortenUrlDto.url);
            expect(urlRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
            expect(urlRepository.create).toHaveBeenCalledWith({
                originalUrl: createShortenUrlDto.url,
                shortCode: shortCode,
                userId: userRequest.id,
                accessCount: 0
            });
            expect(result.originalUrl).toBe(urlEntity.originalUrl);
            expect(result.shortUrl).toBe(`${environment.BASE_URL}/${shortCode}`);
        });

        it('should throw ConflictException if short code already exists', async () => {
            const generatedShortCode = 'abc123';
            jest.spyOn(shortCodeUtil, 'generateShortCode').mockReturnValue(generatedShortCode);
            jest.spyOn(urlRepository, 'findByOriginalUrl').mockResolvedValueOnce(null);
            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce(urlEntity);

            await expect(service.execute(createShortenUrlDto, userRequest)).rejects.toThrow(ConflictException);

            expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(createShortenUrlDto.url);
            expect(urlRepository.findByShortCode).toHaveBeenCalledWith(generatedShortCode);
            expect(urlRepository.create).not.toHaveBeenCalled();
        });
    });
});
