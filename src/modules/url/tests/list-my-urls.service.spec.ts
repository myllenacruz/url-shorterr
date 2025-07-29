import { Test, TestingModule } from '@nestjs/testing';
import { ListMyUrlsService } from '@modules/url/services/list-my-urls.service';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { urlEntity } from './mocks/url.mock';
import { userRequest } from '@src/authentication/tests/mocks/user-request.mock';

describe('ListMyUrlsService', () => {
    let service: ListMyUrlsService;
    let urlRepository: UrlRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListMyUrlsService,
                {
                    provide: UrlRepository,
                    useFactory: () => ({
                        findAllByUserId: jest.fn().mockResolvedValue([urlEntity])
                    })
                }
            ]
        }).compile();

        service = module.get<ListMyUrlsService>(ListMyUrlsService);
        urlRepository = module.get<UrlRepository>(UrlRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        it('should call urlRepository.findAllByUserId with correct paramaters', async () => {
            await service.execute(userRequest);
            expect(urlRepository.findAllByUserId).toHaveBeenCalledWith(userRequest.id);
        });
    });
});
