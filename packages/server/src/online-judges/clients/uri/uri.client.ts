import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';

import { Problem } from '../../../problems/problems.entity';
import { Verdict } from '../../../submissions/submissions.entity';
import { OnlineJudge } from '../../online-judge.interface';
import { clickAndWaitForNavigation } from '../../online-judge.utils';
import { uriInfo } from './uri.info';

const BASE_URL = 'https://www.urionlinejudge.com.br';
const LOGIN_PAGE_PATH = '/judge/pt/login';

@Injectable()
export class UriClient implements OnlineJudge {
  browser: Browser | undefined;
  page: Page | undefined;
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    void (async () => {
      this.browser = await puppeteer.launch({
        args: [
          '--disable-dev-shm-usage',
          // This is for Heroku deployment
          // https://stackoverflow.com/a/55090914/7651928
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
      this.page = (await this.browser.pages())[0];
      // await this.login();
    })();
  }

  async getPage(): Promise<Page> {
    if (!this.page) {
      this.page = await this.browser?.newPage();
    }

    if (!this.page) {
      // TODO: remove all HttpExceptions for 500 errors and throw normally with stack trace instead
      throw new HttpException(
        'Failed to to create a new puppeteer page',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.page;
  }

  async login() {
    const { URI_CLIENT_EMAIL, URI_CLIENT_PASSWORD } = process.env;
    if (!URI_CLIENT_EMAIL || !URI_CLIENT_PASSWORD) {
      throw new HttpException(
        `At least one bot related environment variables was not found. URI_CLIENT_EMAIL: '${URI_CLIENT_EMAIL}'. URI_CLIENT_PASSWORD: '${URI_CLIENT_PASSWORD}'.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const page = await this.getPage();

    await page.goto(`${BASE_URL}/${LOGIN_PAGE_PATH}`);
    await page.type('#email', URI_CLIENT_EMAIL);
    await page.type('#password', URI_CLIENT_PASSWORD);
    await page.click('#remember-me');
    await clickAndWaitForNavigation(page, 'input.send-green');
  }

  _handleExample(cheerioObject: cheerio.Cheerio) {
    return (
      cheerioObject
        .text()
        .trim()
        // remove duplicated new lines
        .split('\n')
        .filter(Boolean)
        .join('\n')
    );
  }

  async getProblem(problemId: string): Promise<Omit<Problem, 'id'>> {
    const rawProblemUrl = `${BASE_URL}/repository/UOJ_${problemId}.html`;
    const response = await fetch(rawProblemUrl);

    const $ = cheerio.load(await response.text());

    const title = $('h1').text();
    const timelimit = $('strong').first().text().split(' ')[1];
    const description = cheerio.html($('.description').children());
    const input = cheerio.html($('.input').children());
    const output = cheerio.html($('.output').children());

    const inputExamples: string[] = [];
    const outputExamples: string[] = [];

    $('tr td').each((index, element) => {
      if (index < 2) {
        return;
      }

      if (index % 2 == 0) {
        inputExamples.push(this._handleExample($(element)));
      } else {
        outputExamples.push(this._handleExample($(element)));
      }
    });

    return {
      onlineJudgeId: 'uri',
      remoteProblemId: problemId,
      remoteLink: rawProblemUrl,
      title,
      timelimit,
      description,
      input,
      output,
      inputExamples,
      outputExamples,
    };
  }

  async submit(
    problemId: string,
    languageId: string,
    code: string,
    retryCount = 2,
  ): Promise<{ submissionId: string }> {
    const page = await this.getPage();

    const problemUrl = `${BASE_URL}/judge/pt/problems/view/${problemId}`;
    // With JS on, URI will use the ACE Editor for the source code textarea,
    // which don't allow puppeteer to paste the code
    await page.setJavaScriptEnabled(false);
    await page.goto(problemUrl);
    if (await page.$('#error')) {
      throw new HttpException(
        `Problem "${problemId}" was not found at ${problemUrl}.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await page.type('#source-code', code);
    await page.evaluate((languageId: string) => {
      // selecting with the "correct" value will fail due to weird logic while
      // not enabiling JS on the page, so selecting the nth+1 option is needed
      (document.querySelector(
        `select option:nth-child(${Number(languageId) + 1})`,
      ) as HTMLOptionElement).selected = true;
    }, languageId);
    await page.setJavaScriptEnabled(true);
    await clickAndWaitForNavigation(page, 'input.send-green');

    const runUrl = await page.url();
    const expectedUrl = `${BASE_URL}/judge/pt/runs/code/`;
    if (runUrl.includes('login')) {
      if (retryCount > 0) {
        await this.login();
        return this.submit(problemId, languageId, code, retryCount - 1);
      } else {
        throw new HttpException(
          'Bot is not logged in URI Online Judge.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else if (!runUrl.startsWith(expectedUrl)) {
      throw new HttpException(
        `Failed to retrieve the submission id. The page were redirected to a URL different from expected. Expected URL: ${expectedUrl}. Received URL: ${runUrl}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const submissionId = runUrl.split('/').pop();

    if (!submissionId) {
      throw new HttpException(
        'Failed to retrieve the submission id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { submissionId };
  }

  async getSubmissionVerdict(
    submissionId: string,
    retryCount = 2,
  ): Promise<Verdict> {
    const page = await this.getPage();
    await page.goto(`${BASE_URL}/judge/pt/runs/code/${submissionId}`);

    const runUrl = await page.url();
    if (runUrl.includes('login')) {
      if (retryCount > 0) {
        await this.login();
        return this.getSubmissionVerdict(submissionId, retryCount - 1);
      } else {
        throw new HttpException(
          'Bot is not logged in URI Online Judge.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    const rawUriVerdict = await page.$eval('.answer', (el) => el.textContent);
    const formattedUriVerdict = rawUriVerdict?.trim().toUpperCase() ?? '';

    let dojoVerdict: Verdict | undefined;
    if (formattedUriVerdict === '') {
      dojoVerdict = Verdict.PENDING;
    }
    Object.keys(uriInfo.verdicts).forEach((validUriVerdict) => {
      if (formattedUriVerdict.includes(validUriVerdict)) {
        dojoVerdict = uriInfo.verdicts[validUriVerdict];
      }
    });

    if (!dojoVerdict) {
      this.logger.warn({
        message:
          "The scrapped verdict wasn't identified and defaulted to PENDING verdict",
        rawUriVerdict,
        formattedUriVerdict,
      });
    }

    return dojoVerdict ?? Verdict.PENDING;
  }
}
