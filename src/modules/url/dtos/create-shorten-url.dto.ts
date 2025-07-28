import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { urlEntity } from '@modules/url/tests/mocks/url.mock';

export class CreateShortenUrlDto {
    @ApiProperty({ example: urlEntity.originalUrl })
    @IsNotEmpty()
    @IsUrl()
    url: string;
}
