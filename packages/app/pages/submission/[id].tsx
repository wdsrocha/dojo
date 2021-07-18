/* eslint-disable react/no-danger */
import { Card, Descriptions, Typography } from "antd";
import dayjs from "dayjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Hyperlink } from "../../components/Hyperlink";
import { OPTIONS } from "../../utils/fetchOptions";
import { getLanguageById } from "../../utils/onlineJudgeData";

const { Title, Text } = Typography;

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
      ...OPTIONS,
      method: "GET",
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
      <Descriptions className="max-w-lg" size="small" column={1} bordered>
        <Descriptions.Item label="Problema">
          <Hyperlink
            href={`/problem/${data.onlineJudgeId}-${data.remoteProblemId}`}
          >
            {`${data.onlineJudgeId.toUpperCase()}-${data.remoteProblemId}`}
          </Hyperlink>
        </Descriptions.Item>
        <Descriptions.Item label="Veredito">
          {displayVerdict()}
        </Descriptions.Item>
        <Descriptions.Item label="Linguagem">
          {getLanguageById(data.onlineJudgeId, data.remoteLanguageId)}
        </Descriptions.Item>
        <Descriptions.Item label="Autor">
          {/* TODO: link to user profile */}
          <Hyperlink href="/">{data.author.username}</Hyperlink>
        </Descriptions.Item>
        <Descriptions.Item label="Data">
          {/* TODO: handle time zone */}
          {dayjs(data.createdDate).format("DD/MM/YYYY HH:mm")}
        </Descriptions.Item>
      </Descriptions>
      <Card className="mt-4" title="Código fonte">
        <pre>
          <code>{data.code}</code>
        </pre>
      </Card>
    </Card>
  );
};

export default Submission;
