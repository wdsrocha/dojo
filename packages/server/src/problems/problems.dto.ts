import { Problem } from './problems.entity';

export type ProblemList = Pick<
  Problem,
  'onlineJudgeId' | 'remoteProblemId' | 'title'
>[];
