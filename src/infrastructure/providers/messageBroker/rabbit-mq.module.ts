import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { ERabbitMQQueues } from './enums/rabbit-mq-queue.enum';
import { UrlAccessCounterProducer } from './producers/url-access-counter.producer';
import { RabbitMQController } from './rabbit-mq.controller';
import { UrlAccessCounterConsumerService } from './services/url-access-counter.consumer';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Global()
@Module({})
export class RabbitMQModule {
    static forRoot(uri: string): DynamicModule {
        const clients = [];
        const queues = [ERabbitMQQueues.URL_ACCESS_COUNTER];

        for (const queue of queues) {
            clients.push({
                name: queue,
                transport: Transport.RMQ,
                options: {
                    urls: [uri],
                    queue: queue,
                    queueOptions: {
                        durable: true
                    }
                }
            });
        }

        return {
            module: RabbitMQModule,
            controllers: [RabbitMQController],
            imports: [ConfigModule.forRoot(), ClientsModule.register(clients), DatabaseModule],
            providers: [UrlAccessCounterProducer, UrlAccessCounterConsumerService],
            exports: [UrlAccessCounterProducer]
        };
    }
}
