import { ClickOptions, NavigationOptions, Page, Response } from 'puppeteer';

export function clickAndWaitForNavigation(
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
