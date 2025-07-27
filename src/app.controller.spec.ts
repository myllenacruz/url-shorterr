import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, MemoryHealthIndicator, TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AppController } from './app.controller';

describe('AppController', () => {
    let controller: AppController;
    let healthCheckService: HealthCheckService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            imports: [TerminusModule],
            providers: [MemoryHealthIndicator, TypeOrmHealthIndicator]
        }).compile();

        controller = module.get<AppController>(AppController);
        healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('check', () => {
        it('should return status ok', async () => {
            jest.spyOn(healthCheckService, 'check').mockResolvedValue({
                status: 'ok',
                info: {
                    database: {
                        status: 'up'
                    }
                },
                error: {},
                details: {
                    database: {
                        status: 'up'
                    }
                }
            });

            const result = await controller.check();
            expect(result.status).toEqual('ok');
            expect(result.info).toBeDefined();
        });

        it('should return status error when database is down', async () => {
            jest.spyOn(healthCheckService, 'check').mockResolvedValue({
                status: 'error',
                info: {
                    database: { status: 'down' }
                },
                error: {
                    database: {
                        status: 'down',
                        message: 'connect ECONNREFUSED 127.0.0.1:5432 - Database not responding'
                    }
                },
                details: {
                    database: {
                        status: 'down',
                        message: 'connect ECONNREFUSED 127.0.0.1:5432 - Database not responding'
                    }
                }
            });

            const result = await controller.check();
            expect(result.status).toEqual('error');
            expect(result.error?.database.status).toBe('down');
        });
    });
});
