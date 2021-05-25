/* eslint-disable react/no-danger */
import {
 Button, Card, Descriptions, Space, Table, Typography,
} from "antd";
import Meta from "antd/lib/card/Meta";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import Paragraph from "antd/lib/typography/Paragraph";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { ColumnsType } from "antd/lib/table";
import Link from "next/link";

const { Title, Text } = Typography;

export enum Verdict {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  COMPILATION_ERROR = "Compilation error",
  TIME_LIMIT_EXCEEDED = "Time limit exceeded",
  PRESENTATION_ERROR = "Presentation error",
  WRONG_ANSWER = "Wrong answer",
  MEMORY_LIMIT_EXCEEDED = "Memory limit exceeded",
}

interface Submission {
  id: number;
  onlineJudgeId: string;
  remoteSubmissionId: string;
  remoteProblemId: string;
  remoteLanguageId: string;
  code: string;
  verdict: string;
  createdDate: string;
  author: {
    id: number;
    email: string;
    username: string;
  };
}

interface SubmissionResponse {
  data: Submission;
}

export const getServerSideProps: GetServerSideProps<SubmissionResponse> = async ({
  params,
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions/${params?.id}`,
    {
      method: "GET",
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    },
  );

  const data = await response.json();

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
  };
};

const Submission = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const displayVerdict = () => {
    // eslint-disable-next-line no-nested-ternary
    const type = data.verdict === Verdict.PENDING
        ? "secondary"
        : data.verdict === Verdict.ACCEPTED
        ? "success"
        : "danger";
    return <Text type={type}>{data.verdict}</Text>;
  };

  return (
    <Card
      className="card"
      title={<Title level={2}>Submissão #{data.id}</Title>}
    >
      <Descriptions>
        <Descriptions.Item label="Juíz online">
          {data.onlineJudgeId}
        </Descriptions.Item>
        <Descriptions.Item label="Problema">
          {data.remoteProblemId}
        </Descriptions.Item>
        <Descriptions.Item label="Veredito">
          {displayVerdict()}
        </Descriptions.Item>
        <Descriptions.Item label="Linguagem">
          {data.remoteLanguageId}
        </Descriptions.Item>
        <Descriptions.Item label="Autor">
          {data.author?.username}
        </Descriptions.Item>
        <Descriptions.Item label="Submetido em">
          {data.createdDate}
        </Descriptions.Item>
      </Descriptions>
      <Card title="Código fonte">
        <Text code>{data.code}</Text>
      </Card>
    </Card>
  );
};

export default Submission;
