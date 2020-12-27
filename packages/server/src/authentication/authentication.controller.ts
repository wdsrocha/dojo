import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from '../users/users.entity';
import { RegisterDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt/jwt.guard';
import { LocalAuthenticationGuard } from './local/local.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieWithJwtToken(user.id),
    );
    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: Request) {
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getLogoutCookie(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() { user }: RequestWithUser): User {
    return user;
  }
}
