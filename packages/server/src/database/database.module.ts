import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config)],
})
export class DatabaseModule {}
