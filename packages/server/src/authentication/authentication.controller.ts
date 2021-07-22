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
import { RequestWithUser } from './request-with-user.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  register(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(@Req() request: RequestWithUser): User {
    const { user } = request;
    // TODO: find out why res can be undefined and if this is the correct way to
    // do it
    request.res?.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieWithJwtToken(user.id),
    );
    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  logout(@Req() request: Request): void {
    request.res?.setHeader(
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
