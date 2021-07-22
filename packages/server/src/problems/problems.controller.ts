import { Controller, Get, Param, Post } from '@nestjs/common';

import { ProblemList } from './problems.dto';
import { Problem } from './problems.entity';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post(':onlineJudgeId/:remoteProblemId')
  scrap(
    @Param('onlineJudgeId') onlineJudgeId: string,
    @Param('remoteProblemId') remoteProblemId: string,
  ): Promise<Problem> {
    return this.problemsService.scrap(onlineJudgeId, remoteProblemId);
  }

  @Get(':onlineJudgeId/:remoteProblemId')
  findOne(
    @Param('onlineJudgeId') onlineJudgeId: string,
    @Param('remoteProblemId') remoteProblemId: string,
  ): Promise<Problem> {
    return this.problemsService.findOne(onlineJudgeId, remoteProblemId);
  }

  @Get()
  getAll(): Promise<ProblemList> {
    return this.problemsService.getAll();
  }
}
