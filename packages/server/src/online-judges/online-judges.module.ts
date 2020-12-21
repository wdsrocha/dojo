import { Module } from '@nestjs/common';

import { UriAdapter } from './adapters/uri/uri-adapter';
import { UriModule } from './adapters/uri/uri.module';
import { OnlineJudgesService } from './online-judges.service';

@Module({
  imports: [UriModule],
  providers: [OnlineJudgesService, UriAdapter],
})
export class OnlineJudgesModule {}
