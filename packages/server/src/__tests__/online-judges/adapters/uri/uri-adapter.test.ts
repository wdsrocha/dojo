import fetch from 'node-fetch';

import { stubBrowser, stubPage } from '../../../puppeteer.mock';
import { UriAdapter } from './../../../../online-judges/adapters/uri/uri-adapter';
import { problemPage, problemPageNotFound } from './uri-adapter.mock';
const { Response } = jest.requireActual('node-fetch');

jest.mock('node-fetch');

jest.mock('puppeteer', () => ({
  launch() {
    return stubBrowser;
  },
}));

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('UriAdapter', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.URI_BOT_EMAIL = 'email';
    process.env.URI_BOT_PASSWORD = 'password';
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should get the problem title', async () => {
    const uriAdapter = new UriAdapter();
    fetch.mockReturnValue(Promise.resolve(new Response(problemPage)));
    const { title } = await uriAdapter.getProblem('1001');
    expect(title).toBe('Extremamente Básico');
  });

  it('should throw 404 error when getting the problem title for an unknown problem', async () => {
    const uriAdapter = new UriAdapter();
    fetch.mockReturnValue(Promise.resolve(new Response(problemPageNotFound)));
    const { title } = await uriAdapter.getProblem('999');
    expect(title).toBeFalsy();
  });

  it('should submit a problem and receive the submission id', async () => {
    const uriAdapter = new UriAdapter();

    jest
      .spyOn(stubPage, 'url')
      .mockReturnValue(
        await Promise.resolve(
          'https://www.urionlinejudge.com.br/judge/pt/runs/code/20596989',
        ),
      );

    const { submissionId } = await uriAdapter.submit(
      '1000',
      '20',
      'print("Hello World!")',
    );

    expect(submissionId).toBe('20596989');
  });
});
