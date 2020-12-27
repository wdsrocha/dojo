import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';

import { User } from '../users/users.entity';
import { RegisterDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';
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
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return response.send({ ...user, password: undefined });
  }
}
