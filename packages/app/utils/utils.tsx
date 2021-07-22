import { Typography } from "antd";

const { Text } = Typography;

export enum Verdict {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  COMPILATION_ERROR = "Compilation error",
  TIME_LIMIT_EXCEEDED = "Time limit exceeded",
  PRESENTATION_ERROR = "Presentation error",
  WRONG_ANSWER = "Wrong answer",
  MEMORY_LIMIT_EXCEEDED = "Memory limit exceeded",
  RUNTIME_ERROR = "Runtime error",
}

export const displayVerdict = (verdict: string) => {
  // eslint-disable-next-line no-nested-ternary
  const type = verdict === Verdict.PENDING
      ? "secondary"
      : verdict === Verdict.ACCEPTED
      ? "success"
      : "danger";
  return (
    <Text strong={type === "success"} type={type}>
      {verdict}
    </Text>
  );
};

// TODO: Improve this mapping. This is only a temporary solution.
export const getHljsLanguage = (
  onlineJudgeLanguage: string,
): string | undefined => {
  const normalizedLanguage = onlineJudgeLanguage.toLowerCase();
  if (normalizedLanguage.includes("python")) {
    return "python";
  }
  if (normalizedLanguage.includes("c++")) {
    return "cpp";
  }
  if (normalizedLanguage.includes("java")) {
    return "java";
  }
  if (normalizedLanguage[0] === "C") {
    return "c";
  }
  return undefined;
};

export const getProblemId = (onlineJudgeId: string, remoteProblemId: string) => `${onlineJudgeId.toUpperCase()}-${remoteProblemId}`;
