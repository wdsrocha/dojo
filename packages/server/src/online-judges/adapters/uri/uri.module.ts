import { Module } from '@nestjs/common';

import { UriAdapter } from './uri-adapter';

@Module({
  providers: [UriAdapter],
  exports: [UriAdapter],
})
export class UriModule {}
