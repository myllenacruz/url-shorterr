import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dataSource from './data-source';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';
import { UserEntity } from '@infrastructure/database/entities/user/user.entity';

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
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [UserRepository],
    exports: [UserRepository]
})
export class DatabaseModule {}
