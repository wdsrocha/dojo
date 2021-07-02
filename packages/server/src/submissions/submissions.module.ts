import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UriAdapter } from '../online-judges/adapters/uri/uri-adapter';
import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { Queues } from '../queue/queue.enum';
import { SubmissionsConsumer } from './submissions.consumer';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './submissions.entity';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: Queues.Submissions }),
    TypeOrmModule.forFeature([Submission]),
  ],
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    SubmissionsConsumer,
    OnlineJudgesService,
    UriAdapter,
  ],
})
export class SubmissionsModule {}
