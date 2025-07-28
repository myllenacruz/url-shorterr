import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { UrlAccessCounterProducer } from '@src/infrastructure/providers/messageBroker/producers/url-access-counter.producer';
import { UrlRepository } from 'src/infrastructure/database/repositories/url/url.repository';

@Injectable()
export class RedirectUrlService {
    private readonly logger = new Logger(RedirectUrlService.name);

    constructor(
        private readonly urlRepository: UrlRepository,
        private readonly urlAccessCounterProducer: UrlAccessCounterProducer
    ) {}

    public async execute(shortCode: string): Promise<string> {
        const url = await this.urlRepository.findByShortCode(shortCode);
        if (!url) throw new NotFoundException();

        this.logger.debug(`Sending click for shortCode: ${shortCode}`);
        this.urlAccessCounterProducer.sendToQueue(url.shortCode);

        return url.originalUrl;
    }
}
