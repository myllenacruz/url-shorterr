import { Injectable, Logger } from '@nestjs/common';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';

@Injectable()
export class UrlAccessCounterConsumerService {
    private readonly logger = new Logger(UrlAccessCounterConsumerService.name);
    constructor(private readonly urlRepository: UrlRepository) {}

    public async execute(shortCode: string) {
        this.logger.debug(`Received message for short code: ${shortCode}`);

        const url = await this.urlRepository.findByShortCode(shortCode);
        await this.urlRepository.incrementAccessCount(url.id);

        this.logger.debug(`Incremented access count for ${shortCode}`);
    }
}
