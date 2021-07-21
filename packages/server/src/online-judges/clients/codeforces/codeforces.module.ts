import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';

import { CodeforcesClient } from './codeforces.client';

@Module({
  imports: [
    PuppeteerModule.forRoot({
      headless: false,
      args: [
        '--disable-dev-shm-usage',
        // This is for Heroku deployment
        // https://stackoverflow.com/a/55090914/7651928
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    }, 'CodeforcesBrowser'),
  ],
  providers: [CodeforcesClient],
  exports: [CodeforcesClient],
})
export class CodeforcesModule {}
