import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [DatabaseModule, TerminusModule],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
