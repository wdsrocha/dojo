import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as cheerio from 'cheerio';
import { InjectPage } from 'nest-puppeteer';
import fetch from 'node-fetch';
import { Page, Request } from 'puppeteer';
import { Repository } from 'typeorm';

import { Problem } from '../../../problems/problems.entity';
import { Submission, Verdict } from '../../../submissions/submissions.entity';
import { OnlineJudge } from '../../online-judge.interface';
import { clickAndWaitForNavigation } from '../../online-judge.utils';
import { codeforcesInfo } from './codeforces.info';

const BASE_URL = 'https://codeforces.com';

function splitProblemId(problemId: string) {
  const i = problemId.search(/[A-Z]/);
  const contestId = problemId.slice(0, i);
  const problemLetter = problemId.slice(i);
  return [contestId, problemLetter];
}

const routes = {
  problem: (contestId: string, problemLetter: string) =>
    `${BASE_URL}/contest/${contestId}/problem/${problemLetter}`,
  login: () => `${BASE_URL}/enter`,
  submit: () => `${BASE_URL}/problemset/submit`,
  verdict: (contestId: string, submissionId: string) =>
    `${BASE_URL}/contest/${contestId}/submission/${submissionId}`,
};

interface SubmissionPostData {
  csrf_token: string;
  ftaa: string;
  bfaa: string;
  action: string;
  submittedProblemCode: string;
  programTypeId: string;
  source: string;
  tabSize: string;
  sourceFile: string;
  _tta: string;
}

interface ResultsData {
  action: string;
  submissionIds: string;
  csrf_token: string;
}

function formToJson(formData: string) {
  const jsonData: Record<string, string> = {};
  formData.split('&').forEach((entry) => {
    const [key, value] = entry.split('=');
    jsonData[key] = value;
  });
  return jsonData;
}

function jsonToForm(jsonData: Record<string, any>) {
  let formData = '';
  Object.entries(jsonData).forEach(([key, value], index) => {
    if (index) {
      formData += '&';
    }
    formData += `${key}=${value}`;
  });
  return formData;
}

@Injectable()
export class CodeforcesClient implements OnlineJudge {
  // TODO: Remove state. This WILL fail when multiple `submit` requests are made
  // in concurrence. Some possible solutions are:
  // - Don't rely on puppeteer event handler for `submissionId` retrieval
  // - Make this property an object instead, where the key is an unique hash and
  //   the value is the corresponding `submissionId` *
  submissionId: string | null = null;
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectPage('CodeforcesBrowser') private readonly page: Page,
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
  ) {
    void this.login();
  }

  async login() {
    await this.page.goto(routes.login());

    if (this.page.url().includes('/profile')) {
      return;
    }

    const {
      CODEFORCES_CLIENT_USERNAME,
      CODEFORCES_CLIENT_PASSWORD,
    } = process.env;

    if (!CODEFORCES_CLIENT_USERNAME || !CODEFORCES_CLIENT_PASSWORD) {
      throw new HttpException(
        {
          message: `At least one bot related environment variables was not found.`,
          CODEFORCES_CLIENT_USERNAME,
          CODEFORCES_CLIENT_PASSWORD,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.page.type('#handleOrEmail', CODEFORCES_CLIENT_USERNAME);
    await this.page.type('#password', CODEFORCES_CLIENT_PASSWORD);
    await this.page.click('#remember');
    await clickAndWaitForNavigation(this.page, '.submit');
  }

  async getProblem(problemId: string): Promise<Omit<Problem, 'id'>> {
    const [contestId, problemLetter] = splitProblemId(problemId);
    const url = routes.problem(contestId, problemLetter);
    const response = await fetch(url);

    if (!response.url.includes(url)) {
      throw new HttpException(
        `Problem ${problemId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const $ = cheerio.load(await response.text());

    let title = $(
      '#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.title',
    ).text();
    title = title.slice(title.search(' ') + 1);

    const timelimitSelector =
      '#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.time-limit';
    $(`${timelimitSelector} > div`).remove();
    const timelimit = $(timelimitSelector).text();

    const description = $.html(
      $(
        '#pageContent > div.problemindexholder > div.ttypography > div > div:nth-child(2)',
      ).children(),
    );

    const inputSelector =
      '#pageContent > div.problemindexholder > div.ttypography > div > div.input-specification';
    $(`${inputSelector} > div`).remove();
    const input = $.html($(inputSelector).children());

    const outputSelector =
      '#pageContent > div.problemindexholder > div.ttypography > div > div.output-specification';
    $(`${outputSelector} > div`).remove();
    const output = $.html($(outputSelector).children());

    const inputExamples: string[] = [];
    const outputExamples: string[] = [];

    const examplesSelector =
      '#pageContent > div.problemindexholder > div.ttypography > div > div.sample-tests > div.sample-test';
    $(examplesSelector)
      .children()
      .each((i, x) => {
        $(x)
          .children()
          .each((_, y: any) => {
            if (y.name === 'pre') {
              const exampleText = $.html(y)
                .replace(/\<br\>/g, '\n')
                .slice(5, -6);

              if (i % 2 === 0) {
                inputExamples.push(exampleText);
              } else {
                outputExamples.push(exampleText);
              }
            }
          });
      });

    return {
      onlineJudgeId: 'codeforces',
      remoteProblemId: problemId,
      remoteLink: url,
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
  ): Promise<{ submissionId: string }> {
    this.submissionId = null;
    this.page.removeAllListeners();

    await this.page.setRequestInterception(true);

    this.page.addListener('request', async (request: Request) => {
      if (request.url().includes('/problemset/submit?csrf_token')) {
        const formData = request.postData() ?? '';
        const data = (formToJson(formData) as unknown) as SubmissionPostData;
        data.source = encodeURIComponent(code);
        data.submittedProblemCode = problemId;
        data.programTypeId = languageId;
        await request.continue({ postData: jsonToForm(data) });
      } else if (request.url().includes('/diagnosticsResults')) {
        const formData = request.postData() ?? '';
        const data = (formToJson(formData) as unknown) as ResultsData;
        const decodedSubmissionIds = decodeURIComponent(data.submissionIds);
        const parsedSubmissionIds = JSON.parse(decodedSubmissionIds);
        this.submissionId = parsedSubmissionIds[0];
        await request.continue();
      } else {
        await request.continue();
      }
    });

    // If the last request end-up having an error during submission (like
    // invalid languageId, syntax error on code, etc), Codeforces will append an
    // error to the UI which will change the submit button selector. Going to
    // the submit page even if its already on the submission page is a way to
    // make sure that the page will be in the desired state.
    await this.page.goto(routes.submit());
    const submitButtonSelector =
      '#pageContent > form > table > tbody > tr:nth-child(6) > td > div > div > input';
    await clickAndWaitForNavigation(this.page, submitButtonSelector);

    const submissionId = this.submissionId;

    if (submissionId) {
      return { submissionId };
    } else {
      throw new HttpException(
        'Failed to retrieve the submission id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSubmissionVerdict(submissionId: string): Promise<Verdict> {
    const submission = await this.submissionsRepository.findOne({
      where: { remoteSubmissionId: submissionId },
    });

    if (!submission) {
      throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
    }

    const problemId = submission.remoteProblemId;
    const [contestId] = splitProblemId(problemId);

    await this.page.goto(routes.verdict(contestId, submissionId));

    const verdictSelector =
      '#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr.highlighted-row > td:nth-child(5) > span';

    await this.page.waitForSelector(verdictSelector);

    const verdictElement = await this.page.$(verdictSelector);

    const rawVerdict = await this.page.evaluate(
      (el) => el && el.textContent,
      verdictElement,
    );

    let verdict: Verdict | undefined;
    Object.keys(codeforcesInfo.verdicts).forEach((validVerdict) => {
      if (rawVerdict.includes(validVerdict)) {
        verdict = codeforcesInfo.verdicts[validVerdict];
      }
    });

    if (!verdict) {
      this.logger.warn({
        message:
          "The scrapped verdict wasn't identified and defaulted to PENDING verdict",
        rawVerdict,
      });
    }

    return verdict ?? Verdict.PENDING;
  }
}
