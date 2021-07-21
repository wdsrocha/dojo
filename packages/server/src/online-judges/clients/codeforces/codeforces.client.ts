import { Injectable } from '@nestjs/common';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';

import { Problem } from '../../../problems/problems.entity';
import { Verdict } from '../../../submissions/submissions.entity';
import { OnlineJudge } from '../../online-judge.interface';
import { clickAndWaitForNavigation } from '../../online-judge.utils';

const CODEFORCES_BASE_URL = 'https://codeforces.com';

const routes = {
  login: () => `${CODEFORCES_BASE_URL}/enter`,
  // problem: (id: string) => `${CODEFORCES_BASE_URL}/problemset/problem/${id}`,
  submit: () => `${CODEFORCES_BASE_URL}/problemset/submit`,
  // submission: (id: string) => `${CODEFORCES_BASE_URL}/submit/${id}`,
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
    // retryCount = 2,
  ): Promise<{ submissionId: string }> {
    await this.login();

    // await this.page.setRequestInterception(true);
    // this.page.on('request', async (request) => {
    //   if (request.isNavigationRequest() && request.redirectChain().length)
    //     await request.abort();
    //   else await request.continue();
    // });

    await this.page.goto(routes.submit());
    await this.page.waitFor(3000);
    // await clickAndWaitForNavigation(this.page,'a:contains("submit")');
    await this.page.type('#pageContent > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input', problemId);
    await this.page.waitFor(3000);
    await this.page.click('#toggleEditorCheckbox');
    await this.page.waitFor(3000);
    // await this.page.type('#editor', code);
    await this.page.type('.ace_text-input', code);
    await this.page.waitFor(3000);
    await this.page.click('.submit');
    await this.page.waitFor(100000);

    throw new Error('Method not implemented.');
  }

  getSubmissionVerdict(submissionId: string): Promise<Verdict> {
    throw new Error('Method not implemented.');
  }
}
