import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ShortenUrlService } from '@src/modules/url/services/shorten-url.service';
import { UrlController } from '@modules/url/url.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [UrlController],
    providers: [ShortenUrlService],
    exports: [ShortenUrlService]
})
export class UrlModule {}
