import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { User } from '../users/users.entity';
import { CreateSubmissionRequestBody } from './submissions.dto';
import { Submission, Verdict } from './submissions.entity';

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

  async findById(id: string): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne(id, {
      relations: ['author'],
    });

    if (!submission) {
      throw new HttpException(`Submission ${id} was not found`, 404)
    }

    if (submission.verdict !== Verdict.PENDING) {
      return submission;
    }

    const verdict = await this.onlineJudgesService.getSubmissionVerdict(
      submission.onlineJudgeId,
      submission.remoteSubmissionId,
    );

    await this.submissionsRepository.update(id, { verdict });
    const updatedSubmission = await this.submissionsRepository.findOne(id, { relations: ['author'] });

    if (!updatedSubmission) {
      throw new HttpException(`Submission ${id} not found after updated`, 404)
    }

    return updatedSubmission
  }
}
