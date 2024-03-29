/* eslint-disable react/no-danger */
import { Button, Card, Space, Table, Typography } from "antd";
import Meta from "antd/lib/card/Meta";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { ColumnsType } from "antd/lib/table";
import Paragraph from "antd/lib/typography/Paragraph";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { OPTIONS } from "../../utils/fetchOptions";

const { Title, Link: TypographyLink } = Typography;

interface Example {
  input: string;
  output: string;
}

interface ProblemType {
  onlineJudgeId: string;
  remoteProblemId: string;
  remoteLink: string;
  title: string;
  timelimit: string;
  description: string;
  input: string;
  output: string;
  inputExamples: string[];
  outputExamples: string[];
}

interface ProblemResponse {
  data: ProblemType;
}

function isString(x: any): x is string {
  return typeof x === "string";
}

export const getServerSideProps: GetServerSideProps<ProblemResponse> = async ({
  params,
  res,
}) => {
  if (!isString(params?.id)) {
    res.statusCode = 400;
    return { props: { data: {} } };
  }

  const [onlineJudgeId, remoteProblemId] = params?.id?.split("-") ?? [];
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/problems/${onlineJudgeId}/${remoteProblemId}`,
    {
      ...OPTIONS,
      method: "GET",
    }
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

const Problem = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const screens = useBreakpoint();

  // TODO: fix this on backend
  const examples: Example[] = [];
  const { inputExamples: inp, outputExamples: out } = data;
  const n = inp.length > out.length ? inp.length : out.length;
  for (let i = 0; i < n; i += 1) {
    examples.push({
      input: inp[i] ?? "",
      output: out[i] ?? "",
    });
  }

  const columns: ColumnsType<Example> = [
    {
      title: "Exemplos de Entrada",
      dataIndex: "input",
      onCell: () => ({ className: "align-top" }),
      render: function InputExample(input: string) {
        return <pre dangerouslySetInnerHTML={{ __html: input }} />;
      },
    },
    {
      title: "Exemplos de Saída",
      dataIndex: "output",
      onCell: () => ({ className: "align-top" }),
      render: function OutputExample(output: string) {
        return <pre dangerouslySetInnerHTML={{ __html: output }} />;
      },
    },
  ];

  return (
    <Card
      className="card"
      title={<Title level={2}>{data.title}</Title>}
      extra={
        screens.sm ? (
          <Link href={`/submit/${id}`} passHref>
            <Button data-test="problem-submit" size="large" type="primary">
              Submeter
            </Button>
          </Link>
        ) : null
      }
      actions={[
        <Link key="submit" href={`/submit/${id}`} passHref>
          <Button data-test="problem-footer-submit" size="large" type="primary">
            Submeter
          </Button>
        </Link>,
      ]}
    >
      <Meta
        description={
          <Paragraph className="px-6">
            Link original:{" "}
            <TypographyLink href={data.remoteLink} target="_blank">
              {data.onlineJudgeId.toUpperCase()}-{data.remoteProblemId}
            </TypographyLink>
            <br />
            Timelimit: {data.timelimit}
          </Paragraph>
        }
      />
      <Space direction="vertical">
        <Card type="inner" bordered={false} title="Descrição">
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </Card>
        <Card type="inner" bordered={false} title="Entrada">
          <div dangerouslySetInnerHTML={{ __html: data.input }} />
        </Card>
        <Card type="inner" bordered={false} title="Saída">
          <div dangerouslySetInnerHTML={{ __html: data.output }} />
        </Card>
        <Table<Example>
          tableLayout="fixed"
          bordered={false}
          columns={columns}
          dataSource={examples.map((example, index) => ({
            key: index,
            ...example,
          }))}
          pagination={{ hideOnSinglePage: true }}
        />
      </Space>
    </Card>
  );
};

export default Problem;
