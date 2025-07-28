import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserService } from './services/create-user.service';
import { UserEntity } from '@infrastructure/database/entities/user/user.entity';
import { CreateUser } from '@modules/user/decorators/swagger-user.decorator';
import { Public } from '@src/authentication/decorators/public.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly createUserService: CreateUserService) {}

    /**
     * Endpoint to create an user.
     * @param {CreateUserDto} data -The data required to create a new user.
     * @decorator {@link Public} - Marks the endpoint as publicly accessible, bypassing authentication checks.
     * @decorator {@link CreateUser} - Decorator to define Swagger documentation for create an user.
     * @returns {UserEntity} The created user.
     */
    @Post()
    @Public()
    @CreateUser()
    public async create(@Body() data: CreateUserDto): Promise<UserEntity> {
        const user = await this.createUserService.execute(data);
        return user;
    }
}
