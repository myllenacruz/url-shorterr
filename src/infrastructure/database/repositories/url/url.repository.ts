import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from '@infrastructure/database/entities/url/url.entity';
import { CreateUrlDto } from '@modules/url/dtos/create-url.dto';

@Injectable()
export class UrlRepository {
    constructor(@InjectRepository(UrlEntity) private readonly repository: Repository<UrlEntity>) {}

    public async create(data: CreateUrlDto): Promise<UrlEntity> {
        const url = this.repository.create(data);
        return this.repository.save(url);
    }

    public async findByOriginalUrl(originalUrl: string): Promise<UrlEntity | null> {
        return this.repository.findOne({ where: { originalUrl, deletedAt: null } });
    }

    public async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
        return this.repository.findOne({ where: { shortCode, deletedAt: null } });
    }

    public async findAllByUserId(userId: string): Promise<UrlEntity[]> {
        return this.repository.find({
            where: { userId, deletedAt: null },
            order: { createdAt: 'DESC' }
        });
    }
}
