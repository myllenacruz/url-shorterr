import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '@modules/url/url.controller';
import { ShortenUrlService } from '@modules/url/services/shorten-url.service';
import { createShortenUrlDto, shortenUrlResponse, updateUrlDto, urlEntity } from './mocks/url.mock';
import { userRequest } from '@src/authentication/tests/mocks/user-request.mock';
import { ListMyUrlsService } from '@modules/url/services/list-my-urls.service';
import { UpdateUrlService } from '@modules/url/services/update-url.service';

describe('UrlController', () => {
    let controller: UrlController;
    let shortenUrlService: ShortenUrlService;
    let listMyUrlsService: ListMyUrlsService;
    let updateUrlService: UpdateUrlService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                {
                    provide: ShortenUrlService,
                    useFactory: () => ({
                        execute: jest.fn().mockResolvedValueOnce(shortenUrlResponse)
                    })
                },
                {
                    provide: ListMyUrlsService,
                    useFactory: () => ({
                        execute: jest.fn().mockResolvedValueOnce([urlEntity])
                    })
                },
                {
                    provide: UpdateUrlService,
                    useFactory: () => ({
                        execute: jest.fn().mockResolvedValueOnce(urlEntity)
                    })
                }
            ]
        }).compile();

        controller = module.get<UrlController>(UrlController);
        shortenUrlService = module.get<ShortenUrlService>(ShortenUrlService);
        listMyUrlsService = module.get<ListMyUrlsService>(ListMyUrlsService);
        updateUrlService = module.get<UpdateUrlService>(UpdateUrlService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('shorten', () => {
        it('should call shortenUrlService.execute', async () => {
            const shortenUrlServiceSpy = jest.spyOn(shortenUrlService, 'execute');
            await controller.shorten(createShortenUrlDto, userRequest);
            expect(shortenUrlServiceSpy).toHaveBeenCalledWith(createShortenUrlDto, userRequest);
        });

        it('should return url originalUrl and shortUrl', async () => {
            const result = await controller.shorten(createShortenUrlDto, userRequest);
            expect(result.originalUrl).toBeDefined();
            expect(result.shortUrl).toBeDefined();
        });
    });

    describe('listMyUrls', () => {
        it('should call listMyUrlsService.execute', async () => {
            const listMyUrlsServiceSpy = jest.spyOn(listMyUrlsService, 'execute');
            await controller.listMyUrls(userRequest);
            expect(listMyUrlsServiceSpy).toHaveBeenCalledWith(userRequest);
        });

        it('should return user urls', async () => {
            const result = await controller.listMyUrls(userRequest);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBeDefined();
            expect(result[0].originalUrl).toBeDefined();
        });
    });

    describe('update', () => {
        it('should call updateUrlService.execute', async () => {
            const updateUrlServiceSpy = jest.spyOn(updateUrlService, 'execute');
            await controller.update(urlEntity.shortCode, updateUrlDto, userRequest);
            expect(updateUrlServiceSpy).toHaveBeenCalledWith(urlEntity.shortCode, updateUrlDto, userRequest);
        });

        it('should return the updated url entity', async () => {
            const result = await controller.update(urlEntity.shortCode, updateUrlDto, userRequest);
            expect(result.id).toBeDefined();
            expect(result.originalUrl).toBeDefined();
        });
    });
});
