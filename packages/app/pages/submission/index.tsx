import { Card, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Hyperlink } from "../../components/Hyperlink";
import { useSession } from "../../contexts/auth";
import { OPTIONS } from "../../utils/fetchOptions";
import {
  displayVerdict,
  getProblemId,
  tableColumnTextFilterConfig,
  Verdict,
} from "../../utils/utils";

const { Title } = Typography;

interface SubmissionType {
  id: number;
  onlineJudgeId: string;
  remoteProblemId: string;
  verdict: string;
  createdDate: string;
  username: string;
}

const fetcher = (url: string) => fetch(url, {
    ...OPTIONS,
    method: "GET",
  }).then((r) => r.json());

// pagination will be used when the number of submissions in the database gets too
// big
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useSubmissionList = (pagination: TablePaginationConfig) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions/`,
    fetcher,
  );

  const submissionList: SubmissionType[] = Array.isArray(data) ? data : [];

  return {
    submissionList,
    loading: !error && !data,
    error,
  };
};

const usePreviousSubmissionList = (submissionList?: SubmissionType[]) => {
  const ref = useRef<SubmissionType[]>();
  useEffect(() => {
    if (submissionList) {
      ref.current = submissionList;
    }
  }, [submissionList]);
  return ref.current;
};

const Page = () => {
  const { session } = useSession();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });
  const { submissionList, loading } = useSubmissionList(pagination);
  const previousSubmissionList = usePreviousSubmissionList(submissionList);

  const columns: ColumnsType<SubmissionType> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 30,
      fixed: "left",
      render: (_, { id }) => (
        <Hyperlink href={`/submission/${id}`}>{id}</Hyperlink>
      ),
    },
    {
      title: "Autor",
      dataIndex: "username",
      width: 90,
      filters: session
        ? [{ text: "Apenas eu", value: session.user.username }]
        : undefined,
      onFilter: (value, { username }) => value === username,
    },
    {
      title: "Problema",
      width: 0,
      render: (_, { onlineJudgeId, remoteProblemId }) => (
        <Hyperlink href={`/problem/${onlineJudgeId}-${remoteProblemId}`}>
          {`${onlineJudgeId.toUpperCase()}-${remoteProblemId}`}
        </Hyperlink>
      ),
      ...tableColumnTextFilterConfig<SubmissionType>(),
      onFilter: (value, { onlineJudgeId, remoteProblemId }) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        getProblemId(onlineJudgeId, remoteProblemId)
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
    },
    {
      title: "Veredito",
      dataIndex: "verdict",
      width: 40,
      render: (_, { verdict }) => displayVerdict(verdict),
      filters: Object.values(Verdict).map((value) => ({
        text: value,
        value,
      })),
      onFilter: (value, { verdict }) => value === verdict,
    },
    {
      title: "Enviado em",
      dataIndex: "createdDate",
      width: 40,
      render: (_, { createdDate }) => dayjs(createdDate).format("DD/MM/YYYY HH:mm"),
    },
  ];

  const handleTableChange = (currentPagination: TablePaginationConfig) => {
    if (pagination !== currentPagination) {
      setPagination(currentPagination);
    }
  };

  return (
    <Card className="card" title={<Title level={2}>Submissões</Title>}>
      <Table<SubmissionType>
        size="middle"
        bordered
        tableLayout="auto"
        loading={loading}
        pagination={pagination}
        rowKey={(record) => record.id}
        columns={columns}
        scroll={{ x: "100%" }}
        dataSource={submissionList ?? previousSubmissionList ?? []}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default Page;
