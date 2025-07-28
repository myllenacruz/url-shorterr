import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from '../authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { JwtService } from '@nestjs/jwt';
import { authenticationDto } from './mocks/authentication.mock';
import { UserRepository } from '@infrastructure/database/repositories/user/user.repository';

describe('AuthenticationController', () => {
    let controller: AuthenticationController;
    let authenticationService: AuthenticationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [
                JwtService,
                {
                    provide: AuthenticationService,
                    useValue: {
                        execute: jest.fn().mockResolvedValueOnce({ accessToken: 'myAccessToken' })
                    }
                },
                {
                    provide: UserRepository,
                    useValue: {}
                }
            ]
        }).compile();

        controller = module.get<AuthenticationController>(AuthenticationController);
        authenticationService = module.get<AuthenticationService>(AuthenticationService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('auth', () => {
        it('should call authenticationService.execute', async () => {
            const authenticationServiceSpy = jest.spyOn(authenticationService, 'execute');
            await controller.auth(authenticationDto);
            expect(authenticationServiceSpy).toHaveBeenCalledWith(authenticationDto);
        });

        it('should return an access token', async () => {
            const result = await controller.auth(authenticationDto);
            expect(result.accessToken).toBeDefined();
        });
    });
});
