import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dataSource from './data-source';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';
import { UserEntity } from '@infrastructure/database/entities/user/user.entity';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { UrlRepository } from '@infrastructure/database/repositories/url/url.repository';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [dataSource]
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => configService.get('typeorm')
        }),
        TypeOrmModule.forFeature([UserEntity, UrlEntity])
    ],
    providers: [UserRepository, UrlRepository],
    exports: [UserRepository, UrlRepository]
})
export class DatabaseModule {}
