import { Module } from '@nestjs/common';
import { UriAdapter } from './uri-adapter';

@Module({
  providers: [UriAdapter],
})
export class UriModule {}
