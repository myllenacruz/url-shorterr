import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from '@modules/user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    imports: [DatabaseModule, TerminusModule, UserModule],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
