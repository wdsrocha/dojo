import { Card, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const { Title, Link: TypographyLink } = Typography;

interface Problem {
  onlineJudge: string;
  id: string;
  title: string;
}

const PROBLEM_LIST = [
  {
    onlineJudge: "URI",
    id: "1001",
    title: "Extremamente Básico",
  },
  {
    onlineJudge: "URI",
    id: "1865",
    title: "Mjölnir",
  },
  {
    onlineJudge: "URI",
    id: "1904",
    title: "Par ou Ímpar 2.0",
  },
  {
    onlineJudge: "URI",
    id: "2495",
    title: "Onde Está Minha Caneta?",
  },
  {
    onlineJudge: "URI",
    id: "3145",
    title: "Uma Jornada Inesperada",
  },
  {
    onlineJudge: "URI",
    id: "1606",
    title: "As Dicas de Ali Babá",
  },
  {
    onlineJudge: "URI",
    id: "1914",
    title: "De Quem é a Vez?",
  },
  {
    onlineJudge: "URI",
    id: "2045",
    title: "Defendendo Alamo",
  },
  {
    onlineJudge: "URI",
    id: "2898",
    title: "Olimpíadas",
  },
  {
    onlineJudge: "URI",
    id: "1802",
    title: "Catálogo de Livros",
  },
  {
    onlineJudge: "URI",
    id: "3185",
    title: "Evidência Difícil",
  },
  {
    onlineJudge: "URI",
    id: "1006",
    title: "Média 2",
  },
  {
    onlineJudge: "URI",
    id: "1418",
    title: "Outra Crise",
  },
  {
    onlineJudge: "URI",
    id: "1421",
    title: "Tic-Tac-Toe?",
  },
  {
    onlineJudge: "URI",
    id: "1546",
    title: "Feedback",
  },
  {
    onlineJudge: "URI",
    id: "1552",
    title: "Resgate em Queda Livre",
  },
  {
    onlineJudge: "URI",
    id: "1924",
    title: "Vitória e a Indecisão",
  },
  {
    onlineJudge: "URI",
    id: "1930",
    title: "Tomadas",
  },
  {
    onlineJudge: "URI",
    id: "3097",
    title: "Um Desafio Simples",
  },
  {
    onlineJudge: "URI",
    id: "2904",
    title: "Building a Field",
  },
  {
    onlineJudge: "URI",
    id: "1988",
    title: "Circuitos Turísticos",
  },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const useProblemList = (pagination: TablePaginationConfig) => {
  // non-mocked code will be similar to bellow
  // const { data, error } = useSWR<{
  //   results: Array<{ id: { value: string }; gender: string; email: string }>;
  // }>(
  //   `https://randomuser.me/api?page=${pagination.current}&results=${pagination.pageSize}&inc=gender,email,id&seed=x`,
  //   fetcher,
  // );
  //
  // const problemList: Array<Problem> | undefined = data?.results.map(
  //   ({ id: { value }, gender, email }) => ({
  //     onlineJudge: gender,
  //     id: value,
  //     title: email,
  //   })
  // );

  // just to simulate network delay
  const { data, error } = useSWR(
    `https://randomuser.me/api?page=${pagination.current}&results=${pagination.pageSize}&inc=gender,email,id&seed=x`,
    fetcher,
  );

  // just to simulate real data
  // eslint-disable-next-line max-len
  const problemList: Problem[] | undefined = data?.results
    ? PROBLEM_LIST
    : undefined;

  return {
    problemList,
    loading: !error && !data,
    error,
  };
};

const usePreviousProblemList = (problemList?: Problem[]) => {
  const ref = useRef<Problem[]>();
  useEffect(() => {
    if (problemList) {
      ref.current = problemList;
    }
  }, [problemList]);
  return ref.current;
};

const Problem = () => {
  const columns: ColumnsType<Problem> = [
    {
      title: "OJ",
      dataIndex: "onlineJudge",
      width: "72px",
    },
    {
      title: "ID",
      dataIndex: "id",
      width: "128px",
    },
    {
      title: "Título",
      dataIndex: "title",
      render: (
        text: string,
        { onlineJudge, id }: { onlineJudge: string; id: string },
      ) => (
        <Link href={`/problem/${onlineJudge}-${id}`}>
          <TypographyLink>
            {text}
          </TypographyLink>
        </Link>
      ),
      align: "left",
    },
  ];

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 8,
    total: PROBLEM_LIST.length,
  });

  const { problemList, loading } = useProblemList(pagination);

  const previousProblemList = usePreviousProblemList(problemList);

  const handleTableChange = (currentPagination: TablePaginationConfig) => {
    if (pagination !== currentPagination) {
      setPagination(currentPagination);
    }
  };

  return (
    <Card title={<Title level={2}>Problemas</Title>}>
      <Table<Problem>
        size="middle"
        bordered
        tableLayout="fixed"
        loading={loading}
        pagination={pagination}
        rowKey={(record) => `${record.onlineJudge}-${record.id}`}
        columns={columns}
        dataSource={problemList ?? previousProblemList}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default Problem;
