import { Injectable } from '@nestjs/common';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';

import { Problem } from '../../../problems/problems.entity';
import { Verdict } from '../../../submissions/submissions.entity';
import { OnlineJudge } from '../../online-judge.interface';
import { clickAndWaitForNavigation } from '../../online-judge.utils';

const BASE_URL = 'https://codeforces.com';

const routes = {
  problem: (problemId: string) => {
    const i = problemId.search(/[A-Z]/);
    const contestId = problemId.slice(0, i);
    const problemLetter = problemId.slice(i);
    return `${BASE_URL}/contest/${contestId}/problem/${problemLetter}`;
  },
  login: () => `${BASE_URL}/enter`,
  submit: () => `${BASE_URL}/problemset/submit`,
  verdict: (contestId: string, submissionId: string) =>
    `${BASE_URL}/contest/${contestId}/submission/${submissionId}`,
};

@Injectable()
export class CodeforcesClient implements OnlineJudge {
  constructor(@InjectPage('CodeforcesBrowser') private readonly page: Page) {}

  async login() {
    const {
      CODEFORCES_CLIENT_USERNAME,
      CODEFORCES_CLIENT_PASSWORD,
    } = process.env;

    await this.page.goto(routes.login());
    await this.page.type('#handleOrEmail', CODEFORCES_CLIENT_USERNAME);
    await this.page.type('#password', CODEFORCES_CLIENT_PASSWORD);
    await this.page.click('#remember');
    await clickAndWaitForNavigation(this.page, '.submit');
  }

  getProblem(problemId: string): Promise<Omit<Problem, 'id'>> {
    throw new Error('Method not implemented.');
  }

  async submit(
    problemId: string,
    languageId: string,
    code: string,
  ): Promise<{ submissionId: string }> {
    throw new Error('Method not implemented.');
  }

  getSubmissionVerdict(submissionId: string): Promise<Verdict> {
    throw new Error('Method not implemented.');
  }
}
