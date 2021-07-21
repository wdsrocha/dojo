import { Module } from '@nestjs/common';

import { UriClient } from './uri.client';

@Module({
  providers: [UriClient],
  exports: [UriClient],
})
export class UriModule {}
