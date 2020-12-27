import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';

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
    console.log('controller');
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() { user }: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieWithJwtToken(user.id),
    );
    return response.send({ ...user, password: undefined });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getLogoutCookie(),
    );
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() { user }: RequestWithUser): User {
    return { ...user, password: undefined };
  }
}
