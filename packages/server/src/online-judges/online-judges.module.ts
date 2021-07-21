import { Module } from '@nestjs/common';

import { UriModule } from './adapters/uri/uri.module';
import { OnlineJudgesService } from './online-judges.service';

@Module({
  imports: [UriModule],
  providers: [OnlineJudgesService],
  exports: [OnlineJudgesService, UriModule],
})
export class OnlineJudgesModule {}
