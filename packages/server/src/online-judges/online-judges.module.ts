import { Module } from '@nestjs/common';

import { UriModule } from './clients/uri/uri.module';
import { OnlineJudgesService } from './online-judges.service';

@Module({
  imports: [UriModule],
  providers: [OnlineJudgesService],
  exports: [OnlineJudgesService],
})
export class OnlineJudgesModule {}
