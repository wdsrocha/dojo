import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as fetch from 'node-fetch';
import * as puppeteer from 'puppeteer';
import { ClickOptions, NavigationOptions, Page, Response } from 'puppeteer';

import { OnlineJudge } from './../online-judge.interface';
import { info } from './uri.info';

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
  browser: puppeteer.Browser;
  page: puppeteer.Page;
  constructor() {
    (async () => {
      this.browser = await puppeteer.launch();
      this.page = (await this.browser.pages())[0];
      this.login();
    })();
  }

  async login() {
    const { URI_BOT_EMAIL, URI_BOT_PASSWORD } = process.env;
    if (!URI_BOT_EMAIL || !URI_BOT_PASSWORD) {
      throw new HttpException(
        `At least one bot related environment variables was not found. URI_BOT_EMAIL: '${URI_BOT_EMAIL}'. URI_BOT_PASSWORD: '${URI_BOT_PASSWORD}'.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.page.goto(`${BASE_URL}/${LOGIN_PAGE_PATH}`);
    await this.page.type('#email', URI_BOT_EMAIL);
    await this.page.type('#password', URI_BOT_PASSWORD);
    await this.page.click('#remember-me');
    await clickAndWaitForNavigation(this.page, 'input.send-green');
  }

  async getProblem(problemId: string) {
    const rawProblemUrl = `${BASE_URL}/repository/UOJ_${problemId}.html`;
    const response = await fetch(rawProblemUrl);

    const $ = cheerio.load(await response.text());

    const title = $('h1').text();

    return { title };
  }

  async submit(problemId: string, languageId: string, code: string, retryCount = 2) {
    const problemUrl = `${BASE_URL}/judge/pt/problems/view/${problemId}`;
    await this.page.goto(problemUrl);
    if (await this.page.$('#error')) {
      throw new HttpException(
        `Problem "${problemId}" was not found at ${problemUrl}.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.page.type('#editor > textarea', code);
    await this.page.click('.selectize-input');
    await this.page.click(`[data-value="${languageId}"]`);
    await clickAndWaitForNavigation(this.page, 'input.send-green');

    const runUrl = await this.page.url();
    if (runUrl.includes('login')) {
      if (retryCount > 0) {
        await this.login();
        return this.submit(problemId, languageId, code, retryCount - 1)
      } else {
        throw new HttpException(
          'Bot is not logged in URI Online Judge.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const submissionId = runUrl.split('/').pop();
    return { submissionId };
  }

  async getSubmissionVerdict(submissionId: string, retryCount = 2) {
    await this.page.goto(`${BASE_URL}/judge/pt/runs/code/${submissionId}`);

    const runUrl = await this.page.url();
    if (runUrl.includes('login')) {
      if (retryCount > 0) {
        await this.login();
        return this.getSubmissionVerdict(submissionId, retryCount - 1)
      } else {
        throw new HttpException(
          'Bot is not logged in URI Online Judge.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const rawVerdict = await this.page.$eval('.answer', (el) => el.textContent);
    const formattedVerdict = rawVerdict?.trim().toUpperCase() ?? '';
    const validUriVerdict = Object.keys(info.verdicts).find((verdict) =>
      formattedVerdict.includes(verdict),
    );

    if (!validUriVerdict) {
      const errorMessage = `The scrapped verdict "${rawVerdict}" isn't a valid verdict. Valid verdicts are: ${Object.keys(
        info.verdicts,
      )}. Make sure that the Online Judge hasn't changed the verdict names or if there is a bug in the server.`;
      throw new HttpException(errorMessage, 500);
    }

    const verdict =
      info.verdicts[validUriVerdict as keyof typeof info.verdicts];
    return verdict;
  }
}
