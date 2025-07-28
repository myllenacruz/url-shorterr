import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateUrlDto {
    @IsNotEmpty()
    @IsNumber()
    accessCount: number;

    @IsNotEmpty()
    @IsString()
    shortCode: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(6)
    originalUrl: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
