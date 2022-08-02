import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import { Hyperlink } from "./Hyperlink";

const renderStatus = (status: ProblemStatus) => {
  if (status === "accepted") {
    return <CheckCircleFilled style={{ fontSize: 20, color: "green" }} />;
  }
  if (status === "rejected") {
    return <CloseCircleFilled style={{ fontSize: 20, color: "red" }} />;
  }
  return null;
};

interface ContestProblemsProps {
  problems: ProblemOverview[];
}

export const ContestProblems = ({ problems }: ContestProblemsProps) => {
  const columns: ColumnsType<ProblemOverview> = [
    {
      title: "#",
      dataIndex: "id",
      render: (_, { id }) => (
        <Hyperlink href="/">
          <strong>{id}</strong>
        </Hyperlink>
      ),
      width: 50,
      align: "center",
    },
    {
      title: "Origem",
      dataIndex: "origin",
      render: (_, { origin }) => <Hyperlink href="/">{origin}</Hyperlink>,
      responsive: ["sm"],
      width: 200,
    },
    {
      title: "Título",
      dataIndex: "title",
      render: (_, { title, status }) => (
        <div className="flex items-center justify-between">
          <Hyperlink href="/">{title}</Hyperlink>
          {status !== "not submitted" ? (
            <Hyperlink href="/">{renderStatus(status)}</Hyperlink>
          ) : null}
        </div>
      ),
      width: 600,
    },
    {
      title: "Resolvidos / tentados",
      render: (_, { solvedCount, attemptedCount }) => {
        const solvedProportion = attemptedCount
          ? (100 * (solvedCount / attemptedCount)).toFixed(0)
          : 0;
        return (
          <Hyperlink href="/">
            {`${solvedCount} / ${attemptedCount} (${solvedProportion}%)`}
          </Hyperlink>
        );
      },
      responsive: ["sm"],
      width: 175,
    },
  ];

  return (
    <Table<ProblemOverview>
      bordered
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={problems}
      pagination={{ hideOnSinglePage: true, defaultPageSize: 26 }}
    />
  );
};
