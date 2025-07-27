import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dataSource from './data-source';

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
        TypeOrmModule.forFeature()
    ],
    providers: [],
    exports: []
})
export class DatabaseModule {}
