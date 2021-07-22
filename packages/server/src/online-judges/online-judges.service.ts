import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CodeforcesClient } from './clients/codeforces/codeforces.client';
import { UriClient } from './clients/uri/uri.client';
import { OnlineJudge } from './online-judge.interface';

@Injectable()
export class OnlineJudgesService {
  onlineJudges: { [key: string]: OnlineJudge } = {};

  constructor(
    readonly uriClient: UriClient,
    readonly codeforcesClient: CodeforcesClient,
  ) {
    this.onlineJudges['uri'] = uriClient;
    this.onlineJudges['codeforces'] = codeforcesClient;
  }

  isValidOnlineJudge(onlineJudgeId: string): boolean {
    return Object.keys(this.onlineJudges).includes(onlineJudgeId);
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
