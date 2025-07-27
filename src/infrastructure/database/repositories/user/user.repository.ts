import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@infrastructure/database/entities/user/user.entity';
import { CreateUserDto } from '@src/modules/user/dtos/create-user.dto';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) {}

    public async create(data: CreateUserDto): Promise<UserEntity> {
        const user = this.repository.create({
            name: data.name,
            email: data.email,
            password: data.password
        });

        return this.repository.save(user);
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        const user = this.repository.findOne({ where: { email } });
        return user;
    }
}
