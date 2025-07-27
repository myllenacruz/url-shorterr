import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';
import { createUserDto, userEntity } from './mocks/user.mock';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import environment from '@configuration/environment';

describe('CreateUserService', () => {
    let service: CreateUserService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useFactory: () => ({
                        findByEmail: jest.fn(),
                        create: jest.fn().mockResolvedValue(userEntity)
                    })
                }
            ]
        }).compile();

        service = module.get<CreateUserService>(CreateUserService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        it('should call userRepository.findByEmail with correct paramaters', async () => {
            await service.execute(createUserDto);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userEntity.email);
        });

        it('should throw ConflictException if email already exists', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userEntity);
            const execute = service.execute(createUserDto);
            await expect(execute).rejects.toThrow(ConflictException);
        });

        it('should call bcrypt.hash with correct parameters', async () => {
            const hashSpy = jest.spyOn(bcrypt, 'hash');
            await service.execute(createUserDto);
            expect(hashSpy).toHaveBeenCalledWith(createUserDto.password, environment.AUTHENCATION_SALTH);
        });

        it('should call userRepository.create with the hashed password and user data', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword' as never);

            await service.execute(createUserDto);
            expect(userRepository.create).toHaveBeenCalledWith({
                ...createUserDto,
                password: 'hashedPassword'
            });
        });
    });
});
