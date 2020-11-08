export interface OnlineJudge {
  submit(
    problemId: string,
    languageId: string,
    code: string,
  ): Promise<{ submissionId: string }>;
}
