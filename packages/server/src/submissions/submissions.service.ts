import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { Queues, SubmissionJobs } from '../queue/queue.enum';
import { User } from '../users/users.entity';
import { CreateSubmissionRequestBody } from './submissions.dto';
import { Submission, Verdict } from './submissions.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectQueue(Queues.Submissions)
    private submissionsQueue: Queue<Submission>,
    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  async create(
    { onlineJudgeId, problemId, languageId, code }: CreateSubmissionRequestBody,
    user: User,
  ): Promise<Submission> {
    const createdDate = new Date().toISOString();
    const submission = await this.submissionsRepository.save(
      this.submissionsRepository.create({
        onlineJudgeId,
        remoteProblemId: problemId,
        remoteLanguageId: languageId,
        code,
        createdDate,
        author: user,
      }),
    );

    this.submissionsQueue.add(SubmissionJobs.Submit, submission);

    return submission;
  }

  async findById(id: string): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne(id, {
      relations: ['author'],
    });

    if (!submission) {
      throw new HttpException(`Submission ${id} was not found`, 404);
    }

    if (
      submission.verdict !== Verdict.PENDING ||
      !submission.remoteSubmissionId
    ) {
      return submission;
    }

    const verdict = await this.onlineJudgesService.getSubmissionVerdict(
      submission.onlineJudgeId,
      submission.remoteSubmissionId,
    );

    await this.submissionsRepository.update(id, { verdict });
    const updatedSubmission = await this.submissionsRepository.findOne(id, {
      relations: ['author'],
    });

    if (!updatedSubmission) {
      throw new HttpException(`Submission ${id} not found after updated`, 404);
    }

    return updatedSubmission;
  }
}
