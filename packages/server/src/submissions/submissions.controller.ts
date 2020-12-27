import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateSubmissionRequestBody, SubmissionDto } from './submissions.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async create(
    @Body() body: CreateSubmissionRequestBody,
  ): Promise<SubmissionDto> {
    return await this.submissionsService.create(body);
  }

  @Get(':oj/:id')
  async findOne(
    @Param('oj') onlineJudgeId: string,
    @Param('id') remoteSubmissionId: string,
  ): Promise<SubmissionDto> {
    return await this.submissionsService.findOne(
      onlineJudgeId,
      remoteSubmissionId,
    );
  }
}
