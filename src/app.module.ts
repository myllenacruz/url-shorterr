import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from '@modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtGuard } from './authentication/guards/jwt.guard';

@Module({
    imports: [DatabaseModule, TerminusModule, UserModule, AuthenticationModule],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
