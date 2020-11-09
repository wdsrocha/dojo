import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UriAdapter } from '../online-judges/adapters/uri/uri-adapter';
import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionEntity } from './submissions.entity';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionEntity])],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, OnlineJudgesService, UriAdapter],
})
export class SubmissionsModule {}
