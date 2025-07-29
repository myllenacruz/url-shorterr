import { ApiProperty } from '@nestjs/swagger';
import { userEntity } from "@src/modules/user/tests/mocks/user.mock";
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthenticationDto {
    @ApiProperty({ example: userEntity.email })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ example: userEntity.password })
    @IsNotEmpty()
    @Length(4)
    public readonly password: string;
}
