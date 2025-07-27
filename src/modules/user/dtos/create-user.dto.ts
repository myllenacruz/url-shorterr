import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { userEntity } from '../tests/mocks/user.mock';

export class CreateUserDto {
    @ApiProperty({ example: userEntity.name })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: userEntity.email })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: userEntity.password })
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    @MinLength(4)
    password: string;
}
