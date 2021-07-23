import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import { ColumnType } from "antd/lib/table";

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

export function tableColumnTextFilterConfig<T>(): ColumnType<T> {
  const searchInputHolder: { current: Input | null } = { current: null };

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInputHolder.current = node;
          }}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Procurar
        </Button>
        <Button size="small" style={{ width: 90 }} onClick={clearFilters}>
          Resetar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputHolder.current?.select());
      }
    },
  };
}
