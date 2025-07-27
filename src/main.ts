import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import environment from '@configuration/environment';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({ origin: '*' });

    await app.listen(environment.PORT, '0.0.0.0');
}

bootstrap();
