import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { createUserDto, user } from './mocks/user.mock';

describe('UserController', () => {
    let controller: UserController;
    let createUserService: CreateUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: CreateUserService,
                    useFactory: () => ({
                        execute: jest.fn().mockResolvedValueOnce(user)
                    })
                }
            ]
        }).compile();

        controller = module.get<UserController>(UserController);
        createUserService = module.get<CreateUserService>(CreateUserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call createUserService.execute', async () => {
            const createUserServiceSpy = jest.spyOn(createUserService, 'execute');
            await controller.create(createUserDto);
            expect(createUserServiceSpy).toHaveBeenCalledWith(createUserDto);
        });

        it('should return an access token', async () => {
            const result = await controller.create(createUserDto);
            expect(result.id).toBeDefined();
        });
    });
});
