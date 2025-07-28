import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class UpdateUrlDto {
    @ApiProperty({ example: 'https://teddy360.com.br/material/another-long-url' })
    @IsNotEmpty()
    @IsUrl()
    @MaxLength(2048)
    url: string;
}
