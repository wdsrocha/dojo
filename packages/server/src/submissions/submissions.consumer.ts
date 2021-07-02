import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { Queues, SubmissionJobs } from '../queue/queue.enum';
import { Submission } from './submissions.entity';

@Processor(Queues.Submissions)
export class SubmissionsConsumer {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  @Process(SubmissionJobs.Submit)
  async handleSubmitJob(job: Job<Submission>) {
    const {
      id,
      onlineJudgeId,
      remoteProblemId,
      remoteLanguageId,
      code,
    } = job.data;

    const {
      submissionId: remoteSubmissionId,
    } = await this.onlineJudgesService.submit(
      onlineJudgeId,
      remoteProblemId,
      remoteLanguageId,
      code,
    );

    this.submissionsRepository.update(id, { remoteSubmissionId });
  }
}
