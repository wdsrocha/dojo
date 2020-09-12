import { NextApiRequest, NextApiResponse } from "next";
import * as puppeteer from "puppeteer";

import { Submission } from "../../types.d";

// const puppeteer = require("puppeteer");

const baseUrl = "https://www.urionlinejudge.com.br";
const LOGIN_PAGE_PATH = "/judge/pt/login";

function clickAndWaitForNavigation(
  page: puppeteer.Page,
  selector: string,
  clickOptions?: puppeteer.ClickOptions,
  waitOptions?: puppeteer.NavigationOptions
): Promise<puppeteer.Response> {
  return Promise.all([
    page.waitForNavigation(waitOptions),
    page.click(selector, clickOptions),
  ]).then((value: [puppeteer.Response, void]) => value[0]);
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    return response.status(405);
  }

  const {
    problem: { id },
    code,
  }: Submission = JSON.parse(request.body);

  const browser = await puppeteer.launch({
    // headless: false,
    // defaultViewport: null,
  });

  const page = await browser.newPage();
  try {
    await page.goto(`${baseUrl}/${LOGIN_PAGE_PATH}`);
    await page.type("#email", process.env.BOT_EMAIL);
    await page.type("#password", process.env.BOT_PASSWORD);
    await page.click("#remember-me");
    await clickAndWaitForNavigation(page, "input.send-green");

    await page.goto(`${baseUrl}/judge/pt/problems/view/${id}`);
    if (await page.$("#error")) {
      return response.status(404).json({ message: "Problem not found" });
    }

    await page.type("#editor > textarea", code);
    await page.click(".selectize-input");
    await page.click('[data-value="20"]');
    await clickAndWaitForNavigation(page, "input.send-green");

    const runUrl = await page.url();

    if (runUrl.includes("login")) {
      return response.status(403).json({ message: "Not logged in" });
    }

    const runId = runUrl.split("/").pop();

    console.log(runUrl);
    console.log(runId);

    return response.status(200).json({ runId, runUrl });
  } finally {
    page.waitFor(10000);
    browser.close();
  }
};
