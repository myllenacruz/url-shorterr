import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, HealthIndicatorResult, TypeOrmHealthIndicator } from '@nestjs/terminus';
import environment from '@configuration/environment';

@Controller()
export class AppController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator
    ) {}

    /**
     * Endpoint to check the health of the Postgres connection.
     * @decorator {@link Get} - Defines HTTP Get endpoint. In this case, it maps to both "/status" and the root "/" path.
     * @decorator {@link HealthCheck} - Marks this method as a health check handler, enabling NestJS Terminus to run health indicators.
     * @returns {HealthCheckResult} - The result of the health check.
     */
    @Get(['status', '/'])
    @HealthCheck()
    public check(): Promise<HealthCheckResult> {
        return this.healthCheckService.check([
            (): Promise<HealthIndicatorResult> => this.typeOrmHealthIndicator.pingCheck(environment.DATABASE_CONNECTION_NAME)
        ]);
    }
}
