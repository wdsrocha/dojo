import { Injectable } from '@nestjs/common';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';

import { Problem } from '../../../problems/problems.entity';
import { Verdict } from '../../../submissions/submissions.entity';
import { OnlineJudge } from '../../online-judge.interface';
import { clickAndWaitForNavigation } from '../../online-judge.utils';

const SPOJ_BASE_URL = 'https://www.spoj.com';
const BR_SPOJ_BASE_URL = 'https://br.spoj.com';

const routes = {
  login: () => `${SPOJ_BASE_URL}/login`,
  problem: (id: string) => `${BR_SPOJ_BASE_URL}/problems/${id}`,
  submission: (id: string) => `${BR_SPOJ_BASE_URL}/submit/${id}`,
}

@Injectable()
export class SpojAdapter implements OnlineJudge {
  constructor(
    @InjectPage('SpojBrowser') private readonly page: Page) {}

  async login() {
    const { SPOJ_CLIENT_USERNAME, SPOJ_CLIENT_PASSWORD } = process.env;

    await this.page.goto(routes.login());
    await this.page.type('#inputUsername', SPOJ_CLIENT_USERNAME);
    await this.page.type('#inputPassword', SPOJ_CLIENT_PASSWORD);
    await this.page.click('#autologin');
    await clickAndWaitForNavigation(this.page, '.btn-primary');
  }

  getProblem(problemId: string): Promise<Omit<Problem, 'id'>> {
    throw new Error('Method not implemented.');
  }

  async submit(
    problemId: string,
    languageId: string,
    code: string,
    // retryCount = 2,
  ): Promise<{ submissionId: string }> {

    // await this.login();
    // await this.page.goto(routes.problem(
    throw new Error('Method not implemented.');
  }

  getSubmissionVerdict(submissionId: string): Promise<Verdict> {
    throw new Error('Method not implemented.');
  }
}
