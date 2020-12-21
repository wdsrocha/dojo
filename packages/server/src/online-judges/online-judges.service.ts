import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UriAdapter } from './adapters/uri/uri-adapter';

@Injectable()
export class OnlineJudgesService {
  constructor(private readonly uriAdapter: UriAdapter) {}

  async submit(
    onlineJudgeId: string,
    problemId: string,
    languageId: string,
    code: string,
  ): Promise<{ submissionId: string }> {
    if (onlineJudgeId === 'uri') {
      return await this.uriAdapter.submit(problemId, languageId, code);
    } else {
      throw new HttpException(
        `Online Judge "${onlineJudgeId}" was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
