import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ERabbitMQQueues } from '../enums/rabbit-mq-queue.enum';

@Injectable()
export class UrlAccessCounterProducer {
    private readonly logger = new Logger(UrlAccessCounterProducer.name);
    private readonly queue: string = ERabbitMQQueues.URL_ACCESS_COUNTER;

    constructor(
        @Inject(ERabbitMQQueues.URL_ACCESS_COUNTER)
        private client: ClientProxy
    ) {}

    /**
     * Sends a message to the URL access URL_ACCESS_COUNTER queue.
     * @param shortCode The short code that was accessed.
     */
    public sendToQueue(shortCode: string): void {
        try {
            this.client.emit(this.queue, {
                id: new Date().getTime(),
                shortCode: shortCode
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
