import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUrlService } from '@modules/url/services/update-url.service';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
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
                        findByShortCode: jest.fn(),
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
            const updatedUrl = { ...urlEntity, originalUrl: updateUrlDto.url };

            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce({ ...urlEntity, userId: userRequest.id });
            jest.spyOn(urlRepository, 'findByOriginalUrlAndUserId').mockResolvedValueOnce(null);
            jest.spyOn(urlRepository, 'save').mockResolvedValueOnce(updatedUrl);

            const shortCode = 'abf5d7';
            const result = await service.execute(shortCode, updateUrlDto, userRequest);
            expect(result.originalUrl).toBe(updateUrlDto.url);
            expect(urlRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
            expect(urlRepository.findByOriginalUrlAndUserId).toHaveBeenCalledWith(updateUrlDto.url, userRequest.id);
            expect(urlRepository.save).toHaveBeenCalledWith(expect.objectContaining({ originalUrl: updateUrlDto.url }));
        });

        it('should throw NotFoundException if URL does not exist', async () => {
			const shortCode = 'abf5d7';
            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce(null);
            await expect(service.execute(shortCode, updateUrlDto, userRequest)).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if URL has no userId (public)', async () => {
			const shortCode = 'abf5d7';
            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce({ ...urlEntity, userId: null });
            await expect(service.execute(shortCode, updateUrlDto, userRequest)).rejects.toThrow(ForbiddenException);
        });

        it('should throw ForbiddenException if URL belongs to a different user', async () => {
			const shortCode = 'abf5d7';
            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce({ ...urlEntity, userId: 'another-user-id' });
            await expect(service.execute(shortCode, updateUrlDto, userRequest)).rejects.toThrow(ForbiddenException);
        });

        it('should throw ConflictException if another URL with the same new original URL exists for the user', async () => {
			const shortCode = 'abf5d7';
            const existingDifferentUrl = { ...urlEntity, id: 'different-id', originalUrl: updateUrlDto.url };

            jest.spyOn(urlRepository, 'findByShortCode').mockResolvedValueOnce({ ...urlEntity, userId: userRequest.id });
            jest.spyOn(urlRepository, 'findByOriginalUrlAndUserId').mockResolvedValueOnce(existingDifferentUrl);
            await expect(service.execute(shortCode, updateUrlDto, userRequest)).rejects.toThrow(ConflictException);
        });
    });
});
