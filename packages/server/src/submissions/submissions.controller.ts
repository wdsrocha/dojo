import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RequestWithUser } from '../authentication/request-with-user.interface';
import JwtAuthenticationGuard from './../authentication/jwt/jwt.guard';
import { CreateSubmissionRequestBody, SubmissionList } from './submissions.dto';
import { Submission } from './submissions.entity';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() body: CreateSubmissionRequestBody,
    @Req() request: RequestWithUser,
  ): Promise<Submission> {
    return this.submissionsService.create(body, request.user);
  }

  @Get(':id')
  findById(
    @Param('id') id: string
  ): Promise<Submission> {
    return this.submissionsService.findById(id);
  }

  @Get()
  getAll(): Promise<SubmissionList> {
    return this.submissionsService.getAll()
  }
}
