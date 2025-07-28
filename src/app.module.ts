import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from '@modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtGuard } from './authentication/guards/jwt.guard';
import { UrlModule } from '@modules/url/url.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import environment from '@configuration/environment';

@Module({
    imports: [
        DatabaseModule,
        TerminusModule,
        UserModule,
        AuthenticationModule,
        UrlModule,
        ThrottlerModule.forRoot([
            {
                ttl: environment.THROTTLER_TTL,
                limit: environment.THROTTLER_LIMIT
            }
        ])
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
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
