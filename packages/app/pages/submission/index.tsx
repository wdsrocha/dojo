import { Card, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Hyperlink } from "../../components/Hyperlink";
import { OPTIONS } from "../../utils/fetchOptions";

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

  const submissionList: SubmissionType[] = data ?? [];

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

const columns: ColumnsType<SubmissionType> = [
  {
    title: "ID",
    dataIndex: "id",
    width: 40,
    fixed: "left",
  },
  {
    title: "Autor",
    dataIndex: "username",
    width: 110,
  },
  {
    title: "OJ",
    dataIndex: "onlineJudgeId",
    width: 40,
    render: (onlineJudgeId: string) => onlineJudgeId.toUpperCase(),
  },
  {
    title: "Problema",
    dataIndex: "remoteProblemId",
    width: 80,
  },
  {
    title: "Veredito",
    dataIndex: "verdict",
    width: 100,
  },
  {
    title: "Enviado em",
    dataIndex: "createdDate",
    width: 100,
    render: (createdDate: string) => dayjs(createdDate).format("DD/MM/YYYY HH:mm"),
  },
];

export default () => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });

  const { submissionList, loading } = useSubmissionList(pagination);

  const previousSubmissionList = usePreviousSubmissionList(submissionList);

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
        tableLayout="fixed"
        loading={loading}
        pagination={pagination}
        rowKey={(record) => record.id}
        columns={columns}
        scroll={{ x: "100%" }}
        dataSource={submissionList ?? previousSubmissionList}
        onChange={handleTableChange}
      />
    </Card>
  );
};
