import { User } from '../users/users.entity';
import { Submission, Verdict } from './submissions.entity';

export class CreateSubmissionRequestBody {
  onlineJudgeId: string;
  problemId: string;
  languageId: string;
  code: string;
}

export class SubmissionDto {
  onlineJudgeId: string;
  remoteSubmissionId: string;
  remoteProblemId: string;
  remoteLanguageId: string;
  code: string;
  verdict: Verdict;
  createdDate: Date;
}

export type SubmissionList = (
  | User['username']
  | Pick<
      Submission,
      'id' | 'createdDate' | 'onlineJudgeId' | 'remoteProblemId' | 'verdict'
    >
)[];
