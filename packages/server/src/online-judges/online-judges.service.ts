import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UriAdapter } from './adapters/uri/uri-adapter';
import { OnlineJudge } from './online-judge.interface';

@Injectable()
export class OnlineJudgesService {
  constructor(private readonly uriAdapter: UriAdapter) {}

  getProblem(
    onlineJudgeId: string,
    problemId: string,
  ): ReturnType<OnlineJudge['getProblem']> {
    if (onlineJudgeId === 'uri') {
      return this.uriAdapter.getProblem(problemId);
    } else {
      throw new HttpException(
        `Online Judge "${onlineJudgeId}" was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  submit(
    onlineJudgeId: string,
    problemId: string,
    languageId: string,
    code: string,
  ): ReturnType<OnlineJudge['submit']> {
    if (onlineJudgeId === 'uri') {
      return this.uriAdapter.submit(problemId, languageId, code);
    } else {
      throw new HttpException(
        `Online Judge "${onlineJudgeId}" was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  getSubmissionVerdict(
    onlineJudgeId: string,
    submissionId: string,
  ): ReturnType<OnlineJudge['getSubmissionVerdict']> {
    if (onlineJudgeId === 'uri') {
      return this.uriAdapter.getSubmissionVerdict(submissionId);
    } else {
      throw new HttpException(
        `Online Judge "${onlineJudgeId}" was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
