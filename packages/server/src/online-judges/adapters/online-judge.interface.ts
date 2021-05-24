import { Verdict } from "../../submissions/submissions.entity";

export interface OnlineJudge {
  getProblem(problemId: string): Promise<{ title: string }>;
  submit(
    problemId: string,
    languageId: string,
    code: string,
  ): Promise<{ submissionId: string }>;
  getSubmissionVerdict(submissionId: string): Promise<Verdict>
}
