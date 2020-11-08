import { OnlineJudge } from './../online-judge.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { Page, ClickOptions, NavigationOptions, Response } from 'puppeteer';

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

export class UriAdapter implements OnlineJudge {
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
}
