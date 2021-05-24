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

export const getServerSideProps: GetServerSideProps<SubmissionResponse> = async () => ({
  props: {
    data: {
      id: 13,
      onlineJudgeId: "uri",
      remoteSubmissionId: "22945197",
      remoteProblemId: "1001",
      remoteLanguageId: "20",
      code: "print('Hello World!')",
      verdict: "Wrong answer",
      createdDate: "2021-05-24T01:25:42.165Z",
      author: {
        id: 11,
        email: "simple.user.3@mailinator.com",
        username: "user3",
      },
    },
  },
});

const Submission = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const displayVerdict = () => (
    <Text type={data.verdict === Verdict.ACCEPTED ? "success" : "danger"}>
      {data.verdict}
    </Text>
  );

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
        <Descriptions.Item label="Veredito">{displayVerdict()}</Descriptions.Item>
        <Descriptions.Item label="Linguagem">
          {data.remoteLanguageId}
        </Descriptions.Item>
        <Descriptions.Item label="Autor">
          {data.author.username}
        </Descriptions.Item>
        <Descriptions.Item label="Submetido em">
          {data.createdDate}
        </Descriptions.Item>
      </Descriptions>
      <Card title="Código fonte">
        <Text code>
          {data.code}
        </Text>
      </Card>
    </Card>
  );
};

export default Submission;
