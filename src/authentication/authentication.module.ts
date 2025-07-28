import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import environment from '@configuration/environment';
import { AuthenticationStrategy } from './strategies/authentication.strategy';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './authentication.controller';
import { DatabaseModule } from "@src/infrastructure/database/database.module";

@Module({
    imports: [
		DatabaseModule,
        PassportModule,
        JwtModule.register({
            secret: environment.AUTHENCATION_SECRET,
            signOptions: { expiresIn: environment.AUTHENCATION_EXPIRES }
        })
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, AuthenticationStrategy],
    exports: [JwtModule, PassportModule, AuthenticationStrategy]
})
export class AuthenticationModule {}
