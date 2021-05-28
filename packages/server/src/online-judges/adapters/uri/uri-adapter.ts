import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as puppeteer from 'puppeteer';
import {
  Browser,
  ClickOptions,
  NavigationOptions,
  Page,
  Response,
} from 'puppeteer';

import { Problem } from '../../../problems/problems.entity';
import { Verdict } from '../../../submissions/submissions.entity';
import { OnlineJudge } from './../online-judge.interface';
import { uriInfo } from './uri.info';

function clickAndWaitForNavigation(
  page: Page,
  selector: string,
  clickOptions?: ClickOptions,
  waitOptions?: NavigationOptions,
): Promise<Response> {
  return Promise.all([
    page.waitForNavigation(waitOptions),
    page.click(selector, clickOptions),
  ]).then((value: [Response, void]) => value[0]);
}

const BASE_URL = 'https://www.urionlinejudge.com.br';
const LOGIN_PAGE_PATH = '/judge/pt/login';

// TODO: Verificar qual o melhor pp (adapter ta com mt responsa, ver facade)
@Injectable()
export class UriAdapter implements OnlineJudge {
  browser: Browser | undefined;
  page: Page | undefined;
  constructor() {
    (async () => {
      this.browser = await puppeteer.launch({
        args: ['--disable-dev-shm-usage'],
      });
      this.page = (await this.browser.pages())[0];
      this.login();
    })();
  }

  async getPage(): Promise<Page> {
    if (!this.page) {
      this.page = await this.browser?.newPage();
    }

    if (!this.page) {
      throw new HttpException(
        'Failed to to create a new puppeteer page',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.page;
  }

  async login() {
    const { URI_BOT_EMAIL, URI_BOT_PASSWORD } = process.env;
    if (!URI_BOT_EMAIL || !URI_BOT_PASSWORD) {
      throw new HttpException(
        `At least one bot related environment variables was not found. URI_BOT_EMAIL: '${URI_BOT_EMAIL}'. URI_BOT_PASSWORD: '${URI_BOT_PASSWORD}'.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const page = await this.getPage();

    await page.goto(`${BASE_URL}/${LOGIN_PAGE_PATH}`);
    await page.type('#email', URI_BOT_EMAIL);
    await page.type('#password', URI_BOT_PASSWORD);
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
    await page.goto(problemUrl);
    if (await page.$('#error')) {
      throw new HttpException(
        `Problem "${problemId}" was not found at ${problemUrl}.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await page.type('#editor > textarea', code);
    await page.click('.selectize-input');
    await page.click(`[data-value="${languageId}"]`);
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
      // eslint-disable-next-line no-console
      console.warn({
        message:
          "The scrapped verdict wasn't identified and defaulted to PENDING verdict",
        rawUriVerdict,
        formattedUriVerdict,
      });
    }

    return dojoVerdict ?? Verdict.PENDING;
  }
}
