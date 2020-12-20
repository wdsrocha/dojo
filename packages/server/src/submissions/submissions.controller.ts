import { Body, Controller, Post } from '@nestjs/common';

import {
  CreateSubmissionRequestBody,
  CreateSubmissionResponseBody,
} from './submissions.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async create(
    @Body() body: CreateSubmissionRequestBody,
  ): Promise<CreateSubmissionResponseBody> {
    return await this.submissionsService.submit(body);
  }
}
