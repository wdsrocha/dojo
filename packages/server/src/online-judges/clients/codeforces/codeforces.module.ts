import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuppeteerModule } from 'nest-puppeteer';

import { Submission } from '../../../submissions/submissions.entity';
import { CodeforcesClient } from './codeforces.client';

@Module({
  imports: [
    PuppeteerModule.forRoot(
      {
        args: [
          '--disable-dev-shm-usage',
          // This is for Heroku deployment
          // https://stackoverflow.com/a/55090914/7651928
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      },
      'CodeforcesBrowser',
    ),
    // TODO: Find a way to don't depend on contestId to retrieve the submission
    // verdict 😕 *
    TypeOrmModule.forFeature([Submission]),
  ],
  providers: [CodeforcesClient],
  exports: [CodeforcesClient],
})
export class CodeforcesModule {}
