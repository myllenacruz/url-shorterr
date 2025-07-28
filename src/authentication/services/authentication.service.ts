import { Injectable, UnauthorizedException } from '@nestjs/common';
import environment from '@configuration/environment';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationDto } from '../dtos/authentication.dto';
import { UserEntity } from '@src/infrastructure/database/entities/user/user.entity';
import { UserRepository } from '@src/infrastructure/database/repositories/user/user.repository';
import { IUserAuthenticate } from '../interfaces/user-authenticate.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Executes the authentication process and returns a access token.
     * @param {AuthenticationDto} data - The authentication data.
     * @returns {IUserAuthenticate} - The user authenticate response data.
     */
    public async execute(data: AuthenticationDto): Promise<IUserAuthenticate> {
        const { email, password } = data;
        const user: UserEntity | null = await this.userRepository.findByEmail(email);

        if (!user || user.deletedAt) throw new UnauthorizedException();

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException();

        const payload = {
            sub: user.id,
            name: user.name,
            email: data.email
        };

        const accessToken: string = this.jwtService.sign(payload, {
            secret: environment.AUTHENCATION_SECRET,
            expiresIn: environment.AUTHENCATION_EXPIRES
        });

        return { accessToken };
    }
}
