import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUrlService } from '@modules/url/services/delete-url.service';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { urlEntity } from './mocks/url.mock';
import { userRequest } from '@src/authentication/tests/mocks/user-request.mock';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUrlService', () => {
    let service: DeleteUrlService;
    let urlRepository: UrlRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteUrlService,
                {
                    provide: UrlRepository,
                    useFactory: () => ({
                        findByShortCodeAndUserId: jest.fn().mockResolvedValue(urlEntity),
                        softDelete: jest.fn()
                    })
                }
            ]
        }).compile();

        service = module.get<DeleteUrlService>(DeleteUrlService);
        urlRepository = module.get<UrlRepository>(UrlRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        it('should throw NotFoundException if url was not found', async () => {
            jest.spyOn(urlRepository, 'findByShortCodeAndUserId').mockResolvedValueOnce(null);
            const execute = service.execute(urlEntity.shortCode, userRequest);
            await expect(execute).rejects.toThrow(NotFoundException);
        });

        it('should call urlRepository.softDelete with correct paramaters', async () => {
            await service.execute(urlEntity.shortCode, userRequest);
            expect(urlRepository.softDelete).toHaveBeenCalledWith(urlEntity.id);
        });
    });
});
