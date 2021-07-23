/* eslint-disable react/no-danger */
import SyntaxHighlighter from "react-syntax-highlighter";
import { Card, Descriptions, Typography } from "antd";
import dayjs from "dayjs";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import { Hyperlink } from "../../components/Hyperlink";
import { OPTIONS } from "../../utils/fetchOptions";
import { getLanguageById } from "../../utils/onlineJudgeData";
import { displayVerdict, getHljsLanguage } from "../../utils/utils";

const { Title } = Typography;

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

  const data: Submission = await response.json();

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
  const language = getLanguageById(data.onlineJudgeId, data.remoteLanguageId);
  const router = useRouter();

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
          <div className="flex justify-between">
            {displayVerdict(data.verdict)}
            {data.verdict === "Pending" ? (
              <Typography.Link onClick={() => router.reload()}>
                Recarregar
              </Typography.Link>
            ) : null}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Linguagem">{language}</Descriptions.Item>
        <Descriptions.Item label="Autor">
          {/* TODO: link to user profile */}
          <Hyperlink href="/">{data.author.username}</Hyperlink>
        </Descriptions.Item>
        <Descriptions.Item label="Data">
          {/* TODO: handle time zone */}
          {dayjs(data.createdDate).format("DD/MM/YYYY HH:mm")}
        </Descriptions.Item>
      </Descriptions>
      <Card className="mt-4" bodyStyle={{ padding: 0 }} title="Código fonte">
        <SyntaxHighlighter
          language={getHljsLanguage(language ?? "")}
          style={github}
          showLineNumbers
          wrapLines
        >
          {data.code}
        </SyntaxHighlighter>
      </Card>
    </Card>
  );
};

export default Submission;
