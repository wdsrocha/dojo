import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { User } from '../users/users.entity';
import { CreateSubmissionRequestBody } from './submissions.dto';
import { Submission } from './submissions.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,

    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  async create(
    { onlineJudgeId, problemId, languageId, code }: CreateSubmissionRequestBody,
    user: User,
  ): Promise<Submission> {
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
      author: user,
    });

    return this.submissionsRepository.save(submission);
  }

  findOne(
    onlineJudgeId: string,
    remoteSubmissionId: string,
  ): Promise<Submission> {
    return this.submissionsRepository.findOne(
      {
        onlineJudgeId,
        remoteSubmissionId,
      },
      { relations: ['author'] },
    );
  }
}
