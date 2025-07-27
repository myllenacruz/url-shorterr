import { UserEntity } from '@src/infrastructure/database/entities/user/user.entity';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';

export const user: Omit<UserEntity, 'password'> = {
    id: '41d475a3-f651-483c-8284-2b0bd30fd907',
    name: 'Teddy',
    email: 'teddy@mail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
};

export const userEntity: UserEntity = {
    ...user,
    password: '1234'
};

export const createUserDto: CreateUserDto = {
    name: user.name,
    email: user.email,
    password: userEntity.password
};
