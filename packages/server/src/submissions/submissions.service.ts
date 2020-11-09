import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { CreateSubmissionRequestBody } from './submissions.dto';
import { SubmissionEntity } from './submissions.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(SubmissionEntity)
    private submissionsRepository: Repository<SubmissionEntity>,

    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  async submit({
    onlineJudgeId,
    problemId,
    languageId,
    code,
  }: CreateSubmissionRequestBody): Promise<{ submissionId: string }> {
    const createdDate = new Date().toISOString();
    const { submissionId } = await this.onlineJudgesService.submit(
      onlineJudgeId,
      problemId,
      languageId,
      code,
    );
    this.submissionsRepository.save({
      onlineJudgeId,
      remoteSubmissionId: submissionId,
      remoteProblemId: problemId,
      remoteLanguageId: languageId,
      code,
      createdDate,
    });
    return { submissionId };
  }
}
