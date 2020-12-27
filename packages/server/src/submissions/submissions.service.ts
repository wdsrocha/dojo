import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { CreateSubmissionRequestBody, SubmissionDto } from './submissions.dto';
import { Submission } from './submissions.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,

    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  async create({
    onlineJudgeId,
    problemId,
    languageId,
    code,
  }: CreateSubmissionRequestBody): Promise<SubmissionDto> {
    const createdDate = new Date().toISOString();
    const { submissionId } = await this.onlineJudgesService.submit(
      onlineJudgeId,
      problemId,
      languageId,
      code,
    );

    const submission = this.submissionsRepository.create({
      onlineJudgeId,
      remoteSubmissionId: submissionId,
      remoteProblemId: problemId,
      remoteLanguageId: languageId,
      code,
      createdDate,
    });

    return this.submissionsRepository.save(submission);
  }

  findOne(
    onlineJudgeId: string,
    remoteSubmissionId: string,
  ): Promise<SubmissionDto> {
    return this.submissionsRepository.findOne({
      onlineJudgeId,
      remoteSubmissionId,
    });
  }
}
