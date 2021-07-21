import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OnlineJudgesModule } from '../online-judges/online-judges.module';
import { ProblemsController } from './problems.controller';
import { Problem } from './problems.entity';
import { ProblemsService } from './problems.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem]), OnlineJudgesModule],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule {}
