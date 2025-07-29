import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../services/authentication.service';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { authenticationDto } from './mocks/authentication.mock';
import { userEntity } from '@modules/user/tests/mocks/user.mock';
import { JwtService } from '@nestjs/jwt';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let userRepository: UserRepository;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthenticationService,
                JwtService,
                {
                    provide: UserRepository,
                    useFactory: () => ({
                        findByEmail: jest.fn()
                    })
                }
            ]
        }).compile();

        service = module.get<AuthenticationService>(AuthenticationService);
        userRepository = module.get<UserRepository>(UserRepository);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        it('should call userRepository.findByEmail with correct paramaters', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userEntity);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

            await service.execute(authenticationDto);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(authenticationDto.email);
        });

        it('should throw UnauthorizedException if email not exists', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
            const execute = service.execute(authenticationDto);
            await expect(execute).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user was deleted', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ ...userEntity, deletedAt: new Date() });
            const execute = service.execute(authenticationDto);
            await expect(execute).rejects.toThrow(UnauthorizedException);
        });

        it('should call bcrypt.compare with correct parameters', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userEntity);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

            const compareSpy = jest.spyOn(bcrypt, 'compare');
            await service.execute(authenticationDto);
            expect(compareSpy).toHaveBeenCalledWith(authenticationDto.password, userEntity.password);
        });

        it('should call jwtService.sign with the payload data', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userEntity);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
            const jwtServiceSignSpy = jest.spyOn(jwtService, 'sign');

            await service.execute(authenticationDto);
            expect(jwtServiceSignSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    sub: userEntity.id,
                    name: userEntity.name,
                    email: authenticationDto.email
                }),
                expect.objectContaining({
                    expiresIn: expect.any(String),
                    secret: expect.any(String)
                })
            );
        });
    });
});
