import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import environment from '@configuration/environment';
import { ValidationPipe } from '@nestjs/common';
import { documentationConfig } from '@configuration/documentation';
import { ERabbitMQQueues } from '@infrastructure/providers/messageBroker/enums/rabbit-mq-queue.enum';
import { Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    documentationConfig(app);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({ origin: '*' });

    /**
     * Configures the RabbitMQ connection for the specified queues.
     */
    const queues = [ERabbitMQQueues.URL_ACCESS_COUNTER];
    for (const queue of queues) {
        app.connectMicroservice({
            transport: Transport.RMQ,
            options: {
                urls: [environment.RABBITMQ_URL],
                queue,
                prefetchCount: 10,
                noAck: false,
                queueOptions: {
                    durable: true
                }
            }
        });
    }

    console.log('');
    await app.startAllMicroservices();
    await app.listen(environment.PORT, '0.0.0.0');
}

bootstrap();
