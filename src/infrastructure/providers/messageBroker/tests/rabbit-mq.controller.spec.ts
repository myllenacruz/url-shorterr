import { Test, TestingModule } from '@nestjs/testing';
import { RmqContext } from '@nestjs/microservices';
import { RabbitMQController } from '../rabbit-mq.controller';
import { accessCounterMessage, contextMessage, LoggerMock } from './mocks/rabbit-mq.mock';
import { UrlAccessCounterConsumerService } from '../services/url-access-counter.consumer';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';
import { Channel } from 'amqplib';

describe('RabbitMQController', () => {
    let controller: RabbitMQController;
    let urlAccessCounterConsumerService: UrlAccessCounterConsumerService;

    /**
     *  Mock the reference to the original RMQ channel.
     * @type {any}
     */
    let contextChannel: jest.Mocked<Channel> = {};

    const mockContext = {
        getChannelRef: () => contextChannel,
        getMessage: () => contextMessage
    } as unknown as RmqContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RabbitMQController],
            providers: [
                UrlAccessCounterConsumerService,
                {
                    provide: UrlRepository,
                    useValue: {}
                }
            ]
        }).compile();

        controller = module.get<RabbitMQController>(RabbitMQController);
        contextChannel = { ack: jest.fn(), nack: jest.fn() };

        /**
         *  Mock Logger to avoiding log error in test.
         */
        controller.logger = new LoggerMock();
        urlAccessCounterConsumerService = module.get<UrlAccessCounterConsumerService>(UrlAccessCounterConsumerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('accessCounter', () => {
        it('should call urlAccessCounterConsumerService.execute and ack the message on successful execution', async () => {
            jest.spyOn(urlAccessCounterConsumerService, 'execute').mockResolvedValue();

            await controller.accessCounter(accessCounterMessage, mockContext);
            expect(urlAccessCounterConsumerService.execute).toHaveBeenCalledWith(accessCounterMessage.shortCode);
            expect(contextChannel.ack).toHaveBeenCalledWith(contextMessage);
        });

        it('should log error message and not ack the message if urlAccessCounterConsumerService throws', async () => {
            const loggerErrorSpy = jest.spyOn(controller.logger, 'error');
            jest.spyOn(urlAccessCounterConsumerService, 'execute').mockRejectedValue(new Error());
            await controller.accessCounter(accessCounterMessage, mockContext);

            expect(urlAccessCounterConsumerService.execute).toHaveBeenCalledWith(accessCounterMessage.shortCode);
            expect(contextChannel.ack).not.toHaveBeenCalled();
            expect(loggerErrorSpy).toHaveBeenCalled();
        });

        it('should log the complete error if the error object does not have a message property', async () => {
            const loggerErrorSpy = jest.spyOn(controller.logger, 'error');
            jest.spyOn(urlAccessCounterConsumerService, 'execute').mockRejectedValue(new Error());

            await controller.accessCounter(accessCounterMessage, mockContext);
            expect(loggerErrorSpy).toHaveBeenCalled();
        });
    });
});
