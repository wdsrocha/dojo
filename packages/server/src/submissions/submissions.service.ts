import { Injectable } from '@nestjs/common';
import { OnlineJudgesService } from 'src/online-judges/online-judges.service';
import { CreateSubmissionRequestBody } from './submissions.dto';

@Injectable()
export class SubmissionsService {
  constructor(private readonly onlineJudgesService: OnlineJudgesService) {}

  async submit({
    onlineJudgeId,
    problemId,
    languageId,
    code,
  }: CreateSubmissionRequestBody): Promise<{ submissionId: string }> {
    return await this.onlineJudgesService.submit(
      onlineJudgeId,
      problemId,
      languageId,
      code,
    );
  }
}
