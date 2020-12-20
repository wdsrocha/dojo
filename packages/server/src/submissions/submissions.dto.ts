export class CreateSubmissionRequestBody {
  onlineJudgeId: string;
  problemId: string;
  languageId: string;
  code: string;
}

export class CreateSubmissionResponseBody {
  submissionId: string;
}
