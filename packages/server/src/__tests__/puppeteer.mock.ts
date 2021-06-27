/* eslint-disable @typescript-eslint/no-unused-vars */
import { Browser, Page, NavigationOptions, ClickOptions } from 'puppeteer';

export const stubPage = ({
  goto: (_url: string) => Promise.resolve(),
  $: (_selector: string) => Promise.resolve(),
  type: (_selector: string, _text: string) => Promise.resolve(),
  click: (_selector: string, _clickOptions: ClickOptions) => Promise.resolve(),
  waitForNavigation: (_navigationOptions: NavigationOptions) =>
    Promise.resolve(),
  url: (): Promise<string> => Promise.resolve(''),
  setJavaScriptEnabled: () => Promise.resolve(),
  evaluate: () => Promise.resolve()
} as unknown) as Page;

export const stubBrowser = ({
  newPage: () => Promise.resolve(stubPage),
  close: () => Promise.resolve(),
  pages: () => Promise.resolve([stubPage]),
} as unknown) as Browser;

export const stubPuppeteer = ({
  launch: () => Promise.resolve(stubBrowser),
} as unknown) as any;
