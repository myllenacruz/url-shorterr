import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ShortenUrlService } from '@src/modules/url/services/shorten-url.service';
import { UrlController } from '@modules/url/url.controller';
import { RedirectUrlService } from '@modules/url/services/redirect-url.service';
import { ListMyUrlsService } from '@modules/url/services/list-my-urls.service';
import { UpdateUrlService } from '@modules/url/services/update-url.service';
import { DeleteUrlService } from '@modules/url/services/delete-url.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UrlController],
    providers: [ShortenUrlService, ListMyUrlsService, UpdateUrlService, RedirectUrlService, DeleteUrlService],
    exports: [ShortenUrlService, ListMyUrlsService, UpdateUrlService, RedirectUrlService, DeleteUrlService]
})
export class UrlModule {}
