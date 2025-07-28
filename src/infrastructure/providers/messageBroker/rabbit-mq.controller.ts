import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel } from 'amqplib';
import { ERabbitMQQueues } from '@infrastructure/providers/messageBroker/enums/rabbit-mq-queue.enum';
import { UrlAccessCounterConsumer } from './services/url-access-counter.consumer';
import { IAccessCounterMessage } from './interfaces/access-counter-message.interface';

@Controller()
export class RabbitMQController {
    public logger = new Logger(RabbitMQController.name);
    constructor(private readonly urlAccessCounterConsumer: UrlAccessCounterConsumer) {}

    /**
     * Processes incoming messages on the queue.
     * @param data The payload of the message containing access counterdata.
     * @param {RmqContext} context The RabbitMQ context providing access to the channel and the original message.
     * @returns {Promise<void>} A promise that resolves to void, indicating that the message has been processed.
     */
    @MessagePattern(ERabbitMQQueues.URL_ACCESS_COUNTER)
    public async execute(@Payload() data: IAccessCounterMessage, @Ctx() context: RmqContext): Promise<void> {
        const channel: Channel = context.getChannelRef();
        const message = context.getMessage();

        const shortCode = data.shortCode;
        this.logger.debug(`Received message for short code: ${shortCode}`);

        try {
            await this.urlAccessCounterConsumer.execute(shortCode);
            channel.ack(message);
        } catch (error) {
            this.logger.error(`URL access count for ${shortCode}: ${error.message}`, error.stack);
            channel.nack(message, false, false);
        }
    }
}
