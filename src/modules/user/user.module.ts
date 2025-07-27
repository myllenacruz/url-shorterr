import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CreateUserService } from './services/create-user.service';
import { UserController } from './user.controller';

@Module({
    imports: [ConfigModule.forRoot(), DatabaseModule],
    controllers: [UserController],
    providers: [CreateUserService],
    exports: [CreateUserService]
})
export class UserModule {}
