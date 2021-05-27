import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OnlineJudgesService } from '../online-judges/online-judges.service';
import { Problem } from './problems.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private problemsRepository: Repository<Problem>,

    private readonly onlineJudgesService: OnlineJudgesService,
  ) {}

  async scrap(
    onlineJudgeId: string,
    remoteProblemId: string,
  ): Promise<Problem> {
    const existingProblem = await this.problemsRepository.findOne({
      onlineJudgeId,
      remoteProblemId,
    });
    const problemWithoutId = await this.onlineJudgesService.getProblem(
      onlineJudgeId,
      remoteProblemId,
    );

    const problem = existingProblem
      ? { id: existingProblem.id, ...problemWithoutId }
      : await this.problemsRepository.create(problemWithoutId);

    return this.problemsRepository.save(problem);
  }

  async findOne(
    onlineJudgeId: string,
    remoteProblemId: string,
  ): Promise<Problem> {
    const problem = await this.problemsRepository.findOne({
      onlineJudgeId,
      remoteProblemId,
    });
    if (!problem) {
      throw new HttpException(
        `Problem ${onlineJudgeId.toUpperCase()}-${remoteProblemId} was not found`,
        404,
      );
    }
    return problem;
  }
}
