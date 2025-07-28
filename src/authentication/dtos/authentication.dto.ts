import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthenticationDto {
    @ApiProperty({ example: 'teddy@email.com' })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ example: 'myPassword' })
    @IsNotEmpty()
    @Length(4)
    public readonly password: string;
}
