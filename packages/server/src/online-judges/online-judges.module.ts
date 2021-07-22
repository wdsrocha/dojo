import { Module } from '@nestjs/common';

import { CodeforcesModule } from './clients/codeforces/codeforces.module';
import { UriModule } from './clients/uri/uri.module';
import { OnlineJudgesService } from './online-judges.service';

@Module({
  imports: [UriModule, CodeforcesModule],
  providers: [OnlineJudgesService],
  exports: [OnlineJudgesService],
})
export class OnlineJudgesModule {}
