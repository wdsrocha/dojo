import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PostgresErrorCode } from '../database/postgres-error-codes.enum';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './authentication.dto';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtToken(userId: number): string {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    const maxAge = this.configService.get('JWT_EXPIRATION_TIME');
    if (process.env.NODE_ENV === 'production') {
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=None; Secure`;
    } else {
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`;
    }
  }

  public async register(registrationData: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  public async getAuthenticatedUser(
    username: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.getByUsername(username);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getLogoutCookie(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
