import { Module } from '@nestjs/common';
import { UriAdapter } from 'src/online-judges/adapters/uri/uri-adapter';
import { OnlineJudgesService } from 'src/online-judges/online-judges.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService, OnlineJudgesService, UriAdapter],
})
export class SubmissionsModule {}
