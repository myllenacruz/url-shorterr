import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Configures Swagger documentation for application.
 * @param {INestApplication} app - The Nest.js application instance.
 * @returns {void}
 */
export function documentationConfig(app: INestApplication): void {
    const documentBuilder = new DocumentBuilder()
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'jwt',
                description: 'Enter JWT Token',
                in: 'header'
            }
        )
        .setTitle('URL Shorter')
        .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup('docs', app, document, { customSiteTitle: 'URL Shorter' });
}