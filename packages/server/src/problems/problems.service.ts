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
    // const { title  } = await this.onlineJudgesService.getProblem(onlineJudgeId, remoteProblemId)
    const problem = this.problemsRepository.create({
      onlineJudgeId,
      remoteProblemId,
      remoteLink: 'https://www.urionlinejudge.com.br/repository/UOJ_1001.html',
      title: 'Extremamente Básico',
      timelimit: '1',
      description:
        '<p>Leia 2 valores inteiros e armazene-os nas variáveis <strong>A</strong> e <strong>B</strong>. Efetue a soma de <strong>A</strong> e <strong>B</strong> atribuindo o seu resultado na variável <strong>X</strong>. Imprima <strong>X</strong> conforme exemplo apresentado abaixo. Não apresente mensagem alguma além daquilo que está sendo especificado e não esqueça de imprimir o fim de linha após o resultado, caso contrário, você receberá "<em>Presentation Error</em>".</p>',
      input: '<p>A entrada contém 2 valores inteiros.</p>',
      output:
        '<p>Imprima a mensagem "X = " (letra X maiúscula) seguido pelo valor da variável <strong> X </strong> e pelo final de linha. Cuide para que tenha um espaço antes e depois do sinal de igualdade, conforme o exemplo abaixo.</p>',
      examples: [
        {
          input: '10<br>9',
          output: 'X = 19',
        },
        {
          input: '-10<br>4',
          output: 'X = -6',
        },
        {
          input: '15<br>-7',
          output: 'X = 8<br>X = 7<br>X = 6<br>X = 8<br>X = 7<br>X = 6',
        },
        {
          input:
            '50<br>1 2 4 6 6 4 2 1 3 5 5 3 1 2 4 4 2 1 3 3 1 2 2 1 1 1 2 4 6 6 4 2 1 3 5 5 3 1 2 4 4 2 1 3 3 1 2 2 1 1',
          output: '1<br>2',
        },
      ],
    });

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
