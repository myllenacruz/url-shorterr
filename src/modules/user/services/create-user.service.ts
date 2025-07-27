import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@infrastructure/database/entities/user/user.entity';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import environment from '@configuration/environment';

@Injectable()
export class CreateUserService {
    constructor(private readonly userRepository: UserRepository) {}

    /**
     * Executes the creation of user.
     * @param data The data for creating the user.
     * @returns {UserEntity} The created user.
     */
    public async execute(data: CreateUserDto): Promise<UserEntity> {
        const existingUser: UserEntity | null = await this.userRepository.findByEmail(data.email);
        if (existingUser) throw new ConflictException('Email already exists');

        const password: string = await bcrypt.hash(data.password, environment.AUTHENCATION_SALTH);
        const user: UserEntity = await this.userRepository.create({ ...data, password });
        return user;
    }
}
