import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';

import { Queues, SubmissionJobs } from '../queue/queue.enum';
import { User } from '../users/users.entity';
import { CreateSubmissionRequestBody, SubmissionList } from './submissions.dto';
import { Submission } from './submissions.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectQueue(Queues.Submissions)
    private submissionsQueue: Queue<Submission>,
  ) {}

  async create(
    { onlineJudgeId, problemId, languageId, code }: CreateSubmissionRequestBody,
    user: User,
  ): Promise<Submission> {
    // TODO: Consider using time sent by the client, as this may invalid a
    // submission made 0.1 second before a contest end.
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

    await this.submissionsQueue.add(SubmissionJobs.Submit, submission, {
      attempts: 24,
      delay: 5000,
    });

    return submission;
  }

  async findById(id: string): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne(id, {
      relations: ['author'],
    });

    if (!submission) {
      throw new HttpException(`Submission ${id} was not found`, 404);
    }

    return submission;
  }

  async getAll(): Promise<SubmissionList> {
    const submissions = await this.submissionsRepository.find({ relations: ['author'] });
    return submissions.map(
      ({
        onlineJudgeId,
        id,
        remoteProblemId,
        verdict,
        createdDate,
        author,
      }) => ({
        onlineJudgeId,
        id,
        remoteProblemId,
        verdict,
        createdDate,
        username: author.username,
      }),
    );
  }
}
