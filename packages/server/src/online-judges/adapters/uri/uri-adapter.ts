import { HttpException, HttpStatus } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as fetch from 'node-fetch';
import * as puppeteer from 'puppeteer';
import { ClickOptions, NavigationOptions, Page, Response } from 'puppeteer';

import { Verdict } from '../../../submissions/submissions.entity';
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

async function login(page: Page) {
  const { URI_BOT_EMAIL, URI_BOT_PASSWORD } = process.env;
  if (!URI_BOT_EMAIL || !URI_BOT_PASSWORD) {
    throw new HttpException(
      `At least one bot related environment variables was not found. URI_BOT_EMAIL: '${URI_BOT_EMAIL}'. URI_BOT_PASSWORD: '${URI_BOT_PASSWORD}'.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  await page.goto(`${BASE_URL}/${LOGIN_PAGE_PATH}`);
  await page.type('#email', URI_BOT_EMAIL);
  await page.type('#password', URI_BOT_PASSWORD);
  await page.click('#remember-me');
  await clickAndWaitForNavigation(page, 'input.send-green');
}

// TODO: Verificar qual o melhor pp (adapter ta com mt responsa, ver facade)
export class UriAdapter implements OnlineJudge {
  async getProblem(problemId: string) {
    const rawProblemUrl = `${BASE_URL}/repository/UOJ_${problemId}.html`;
    const response = await fetch(rawProblemUrl);

    const $ = cheerio.load(await response.text());

    const title = $('h1').text();

    return { title };
  }

  async submit(
    problemId: string,
    languageId: string,
    code: string,
  ): Promise<{ submissionId: string }> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await login(page);

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
      if (runUrl.includes('login')) {
        throw new HttpException(
          'Bot is not logged in URI Online Judge.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const submissionId = runUrl.split('/').pop();
      return { submissionId };
    } finally {
      browser.close();
    }
  }

  async getSubmissionVerdict(submissionId: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await login(page);

      await page.goto(`${BASE_URL}/judge/pt/runs/code/${submissionId}`);
      const rawVerdict = await page.$eval('.answer', (el) => el.textContent);
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

      const verdict: Verdict = info.verdicts[validUriVerdict as keyof typeof info.verdicts];
      return verdict;
    } finally {
      browser.close();
    }
  }
}
