import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';

import { SpojAdapter } from './spoj.client';

@Module({
  imports: [
    PuppeteerModule.forRoot({
      // headless: false,
      args: [
        '--disable-dev-shm-usage',
        // This is for Heroku deployment
        // https://stackoverflow.com/a/55090914/7651928
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    }, 'SpojBrowser'),
  ],
  providers: [SpojAdapter],
  exports: [SpojAdapter],
})
export class SpojModule {}
