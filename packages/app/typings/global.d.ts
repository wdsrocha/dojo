declare type ProblemStatus = "not submitted" | "accepted" | "rejected";

declare interface ProblemOverview {
  id: string;
  origin: string;
  title: string;
  status: ProblemStatus;
  solvedCount: number;
  attemptedCount: number;
}

declare interface Contest {
  title: string;
  startDate: string;
  endDate: string;
  problems: ProblemOverview[];
}
