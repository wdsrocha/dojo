import { Problem } from "../problems/problems.entity";
import { Verdict } from "../submissions/submissions.entity";

export interface OnlineJudge {
  getProblem(problemId: string): Promise<Omit<Problem, 'id'>>;
  submit(
    problemId: string,
    languageId: string,
    code: string,
  ): Promise<{ submissionId: string }>;
  getSubmissionVerdict(submissionId: string): Promise<Verdict>
}
