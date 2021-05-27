import { Card, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const { Title, Link: TypographyLink } = Typography;

interface ProblemType {
  onlineJudgeId: string;
  remoteProblemId: string;
  title: string;
}

const fetcher = (url: string) => fetch(url, {
    method: "GET",
    credentials: "include",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }).then((r) => r.json());

// pagination will be used when the number of problems in the database gets too
// big
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useProblemList = (pagination: TablePaginationConfig) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/problems/`,
    fetcher,
  );

  const problemList: ProblemType[] = data ?? [];

  return {
    problemList,
    loading: !error && !data,
    error,
  };
};

const usePreviousProblemList = (problemList?: ProblemType[]) => {
  const ref = useRef<ProblemType[]>();
  useEffect(() => {
    if (problemList) {
      ref.current = problemList;
    }
  }, [problemList]);
  return ref.current;
};

const columns: ColumnsType<ProblemType> = [
  {
    title: "OJ",
    dataIndex: "onlineJudgeId",
    width: "72px",
    render: (onlineJudgeId: string) => onlineJudgeId.toUpperCase(),
  },
  {
    title: "ID",
    dataIndex: "remoteProblemId",
    width: "128px",
  },
  {
    title: "Título",
    dataIndex: "title",
    render: (
      text: string,
      { onlineJudgeId, remoteProblemId }: ProblemType,
    ) => (
      <Link href={`/problem/${onlineJudgeId}-${remoteProblemId}`}>
        <TypographyLink>{text}</TypographyLink>
      </Link>
    ),
    align: "left",
  },
];

const Problem = () => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });

  const { problemList, loading } = useProblemList(pagination);

  const previousProblemList = usePreviousProblemList(problemList);

  const handleTableChange = (currentPagination: TablePaginationConfig) => {
    if (pagination !== currentPagination) {
      setPagination(currentPagination);
    }
  };

  return (
    <Card className="card" title={<Title level={2}>Problemas</Title>}>
      <Table<ProblemType>
        size="middle"
        bordered
        tableLayout="fixed"
        loading={loading}
        pagination={pagination}
        rowKey={(record) => `${record.onlineJudgeId}-${record.remoteProblemId}`}
        columns={columns}
        dataSource={problemList ?? previousProblemList}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default Problem;
