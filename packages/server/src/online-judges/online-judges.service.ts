import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UriClient } from './clients/uri/uri.client';
import { OnlineJudge } from './online-judge.interface';

@Injectable()
export class OnlineJudgesService {
  onlineJudges: { [key: string]: OnlineJudge } = {};

  constructor(private readonly uriClient: UriClient) {
    this.onlineJudges['uri'] = uriClient;
  }

  isValidOnlineJudge(onlineJudgeId: string): boolean {
    return onlineJudgeId === 'uri';
  }

  throwIfInvalidOnlineJudge(onlineJudgeId: string): void {
    if (!this.isValidOnlineJudge(onlineJudgeId)) {
      throw new HttpException(
        `Online Judge "${onlineJudgeId}" isn't supported.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  getProblem(
    onlineJudgeId: string,
    problemId: string,
  ): ReturnType<OnlineJudge['getProblem']> {
    this.throwIfInvalidOnlineJudge(onlineJudgeId);
    return this.onlineJudges[onlineJudgeId].getProblem(problemId);
  }

  submit(
    onlineJudgeId: string,
    problemId: string,
    languageId: string,
    code: string,
  ): ReturnType<OnlineJudge['submit']> {
    this.throwIfInvalidOnlineJudge(onlineJudgeId);
    return this.onlineJudges[onlineJudgeId].submit(problemId, languageId, code);
  }

  getSubmissionVerdict(
    onlineJudgeId: string,
    submissionId: string,
  ): ReturnType<OnlineJudge['getSubmissionVerdict']> {
    this.throwIfInvalidOnlineJudge(onlineJudgeId);
    return this.onlineJudges[onlineJudgeId].getSubmissionVerdict(submissionId);
  }
}
