import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUrlService } from '@modules/url/services/update-url.service';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { updateUrlDto, urlEntity } from './mocks/url.mock';
import { userRequest } from '@src/authentication/tests/mocks/user-request.mock';

describe('UpdateUrlService', () => {
    let service: UpdateUrlService;
    let urlRepository: UrlRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateUrlService,
                {
                    provide: UrlRepository,
                    useValue: {
                        findByShortCodeAndUserId: jest.fn(),
                        findByOriginalUrlAndUserId: jest.fn(),
                        save: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<UpdateUrlService>(UpdateUrlService);
        urlRepository = module.get(UrlRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        it('should update and return URL if user is the owner and no conflict exists', async () => {
            jest.spyOn(urlRepository, 'findByShortCodeAndUserId').mockResolvedValue(urlEntity);
            jest.spyOn(urlRepository, 'findByOriginalUrlAndUserId').mockResolvedValue(null);

            const saveSpy = jest.spyOn(urlRepository, 'save').mockResolvedValue({ ...urlEntity, originalUrl: updateUrlDto.url });
            const result = await service.execute(urlEntity.shortCode, updateUrlDto, userRequest);

            expect(result).toEqual({ ...urlEntity, originalUrl: updateUrlDto.url });
            expect(saveSpy).toHaveBeenCalledWith({ ...urlEntity, originalUrl: updateUrlDto.url });
        });

        it('should throw NotFoundException if URL does not exist', async () => {
            const shortCode = 'abf5d7';
            jest.spyOn(urlRepository, 'findByShortCodeAndUserId').mockResolvedValueOnce(null);
            await expect(service.execute(shortCode, updateUrlDto, userRequest)).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException if another URL with the same new original URL exists for the user', async () => {
            const shortCode = 'abf5d7';
            const existingDifferentUrl = { ...urlEntity, id: 'different-id', originalUrl: updateUrlDto.url };

            jest.spyOn(urlRepository, 'findByShortCodeAndUserId').mockResolvedValueOnce({ ...urlEntity, userId: userRequest.id });
            jest.spyOn(urlRepository, 'findByOriginalUrlAndUserId').mockResolvedValueOnce(existingDifferentUrl);
            await expect(service.execute(shortCode, updateUrlDto, userRequest)).rejects.toThrow(ConflictException);
        });
    });
});
