import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ShortenUrlService } from '@src/modules/url/services/shorten-url.service';
import { UrlController } from '@modules/url/url.controller';
import { ListMyUrlsService } from "@modules/url/services/list-my-urls.service";
import { UpdateUrlService } from "./services/update-url.service";

@Module({
    imports: [DatabaseModule],
    controllers: [UrlController],
    providers: [ShortenUrlService, ListMyUrlsService, UpdateUrlService],
    exports: [ShortenUrlService, ListMyUrlsService, UpdateUrlService]
})
export class UrlModule {}
