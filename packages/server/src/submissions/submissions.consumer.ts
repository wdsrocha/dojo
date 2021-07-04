import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Queue } from 'bull';
import { DeepPartial, Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { Queues, SubmissionJobs } from '../queue/queue.enum';
import { Submission, Verdict } from './submissions.entity';

@Processor(Queues.Submissions)
export class SubmissionsConsumer {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectQueue(Queues.Submissions)
    private submissionsQueue: Queue<Submission>,
    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  async updateSubmission(
    id: number,
    data: DeepPartial<Submission>,
  ): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne({ id });
    if (!submission) {
      throw new Error(`Submission ${id} not found`);
    }

    const updatedSubmission = { ...submission, ...data };
    return this.submissionsRepository.save(updatedSubmission);
  }

  @Process(SubmissionJobs.Submit)
  async handleSubmitJob(job: Job<Submission>): Promise<string> {
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

    const updatedSubmission = await this.updateSubmission(id, {
      remoteSubmissionId,
    });

    await this.submissionsQueue.add(
      SubmissionJobs.GetVerdict,
      updatedSubmission,
      {
        // TODO: Think in a better strategy
        attempts: 24,
        delay: 5000,
      },
    );

    return remoteSubmissionId;
  }

  @Process(SubmissionJobs.GetVerdict)
  async handleGetVerdictJob(job: Job<Submission>): Promise<Verdict> {
    const { id, onlineJudgeId, remoteSubmissionId } = job.data;
    if (!remoteSubmissionId) {
      throw new Error(`Submission ${id} has no remoteSubmissionId`);
    }

    const verdict = await this.onlineJudgesService.getSubmissionVerdict(
      onlineJudgeId,
      remoteSubmissionId,
    );

    if (verdict === Verdict.PENDING) {
      throw new Error('Verdict is still pending');
    }

    await this.updateSubmission(id, { verdict });

    return verdict;
  }

  @OnQueueActive()
  onActive(job: Job<Submission>) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<Submission>, result: string) {
    this.logger.log(
      `Job ${job.id} of type ${job.name} completed with result ${result}`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job<Submission>, error: Error) {
    this.logger.error(
      `Job ${job.id} of type ${job.name} failed with error ${error}`,
    );
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(error);
  }
}
