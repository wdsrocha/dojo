import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OnlineJudgesModule } from '../online-judges/online-judges.module';
import { Queues } from '../queue/queue.enum';
import { SubmissionsConsumer } from './submissions.consumer';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './submissions.entity';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: Queues.Submissions }),
    TypeOrmModule.forFeature([Submission]),
    OnlineJudgesModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, SubmissionsConsumer],
})
export class SubmissionsModule {}
