import { Card, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Hyperlink } from "../../components/Hyperlink";
import { OPTIONS } from "../../utils/fetchOptions";
import { getProblemId, tableColumnTextFilterConfig } from "../../utils/utils";

const { Title } = Typography;

interface ProblemType {
  onlineJudgeId: string;
  remoteProblemId: string;
  title: string;
}

const fetcher = (url: string) => fetch(url, {
    ...OPTIONS,
    method: "GET",
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
    title: "Problema",
    width: 200,
    render: (_, { onlineJudgeId, remoteProblemId }) => (
      <Hyperlink href={`/problem/${onlineJudgeId}-${remoteProblemId}`}>
        {getProblemId(onlineJudgeId, remoteProblemId)}
      </Hyperlink>
    ),
    filters: [
      {
        text: "URI",
        value: "uri",
      },
      {
        text: "CODEFORCES",
        value: "codeforces",
      },
    ],
    onFilter: (value, { onlineJudgeId }) => value === onlineJudgeId,
    sorter: (a, b) => getProblemId(a.onlineJudgeId, a.remoteProblemId).localeCompare(
        getProblemId(b.onlineJudgeId, b.remoteProblemId),
      ),
  },
  {
    title: "Título",
    dataIndex: "title",
    render: (
      title: string,
      { onlineJudgeId, remoteProblemId }: ProblemType,
    ) => (
      <Hyperlink href={`/problem/${onlineJudgeId}-${remoteProblemId}`}>
        {title}
      </Hyperlink>
    ),
    align: "left",
    ...tableColumnTextFilterConfig<ProblemType>(),
    onFilter: (value, { title }) => title.toLowerCase().includes(value.toString().toLowerCase()),
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
        tableLayout="auto"
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
