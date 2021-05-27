import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UriAdapter } from '../online-judges/adapters/uri/uri-adapter';
import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { ProblemsController } from './problems.controller';
import { Problem } from './problems.entity';
import { ProblemsService } from './problems.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  controllers: [ProblemsController],
  providers: [ProblemsService, OnlineJudgesService, UriAdapter],
})
export class ProblemsModule {}
