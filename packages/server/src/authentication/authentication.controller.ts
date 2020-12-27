import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

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
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
