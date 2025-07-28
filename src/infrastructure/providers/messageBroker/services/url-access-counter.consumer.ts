import { Injectable, Logger } from '@nestjs/common';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';

@Injectable()
export class UrlAccessCounterConsumer {
    private readonly logger = new Logger(UrlAccessCounterConsumer.name);
    constructor(private readonly urlRepository: UrlRepository) {}

    public async execute(shortCode: string) {
        this.logger.debug(`Received message for short code: ${shortCode}`);

        const url = await this.urlRepository.findByShortCode(shortCode);
        if (url) {
            await this.urlRepository.incrementAccessCount(url.id);
            this.logger.debug(`Incremented access count for ${shortCode}`);
        } else {
            this.logger.warn(`Short code '${shortCode}' not found when processing click count message. It might have been deleted.`);
        }
    }
}
