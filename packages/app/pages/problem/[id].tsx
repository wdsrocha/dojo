/* eslint-disable react/no-danger */
import {
 Button, Card, Space, Table, Typography,
} from "antd";
import Meta from "antd/lib/card/Meta";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import Paragraph from "antd/lib/typography/Paragraph";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { ColumnsType } from "antd/lib/table";
import Link from "next/link";

const { Title, Link: TypographyLink } = Typography;

interface Example {
  input: Array<string>;
  output: Array<string>;
}

interface Problem {
  link: string;
  title: string;
  timelimit: string;
  description: string;
  input: string;
  output: string;
  examples: Array<Example>;
}

interface ProblemResponse {
  data: Problem;
}

export const getServerSideProps: GetServerSideProps<ProblemResponse> = async () => ({
  props: {
    data: {
      link: "https://www.urionlinejudge.com.br/repository/UOJ_1001.html",
      title: "Extremamente Básico",
      timelimit: "1",
      description:
        '<p>Leia 2 valores inteiros e armazene-os nas variáveis <strong>A</strong> e <strong>B</strong>. Efetue a soma de <strong>A</strong> e <strong>B</strong> atribuindo o seu resultado na variável <strong>X</strong>. Imprima <strong>X</strong> conforme exemplo apresentado abaixo. Não apresente mensagem alguma além daquilo que está sendo especificado e não esqueça de imprimir o fim de linha após o resultado, caso contrário, você receberá "<em>Presentation Error</em>".</p>',
      input: "<p>A entrada contém 2 valores inteiros.</p>",
      output:
        '<p>Imprima a mensagem "X = " (letra X maiúscula) seguido pelo valor da variável <strong> X </strong> e pelo final de linha. Cuide para que tenha um espaço antes e depois do sinal de igualdade, conforme o exemplo abaixo.</p>',
      examples: [
        {
          input: ["10", "9"],
          output: ["X = 19"],
        },
        {
          input: ["-10", "4"],
          output: ["X = -6"],
        },
        {
          input: ["15", "-7"],
          output: ["X = 8"],
        },
        {
          input: [
            "50",
            "1 2 4 6 6 4 2 1 3 5 5 3 1 2 4 4 2 1 3 3 1 2 2 1 1 1 2 4 6 6 4 2 1 3 5 5 3 1 2 4 4 2 1 3 3 1 2 2 1 1",
          ],
          output: [""],
        },
      ],
    },
  },
});

const Problem = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const screens = useBreakpoint();

  const columns: ColumnsType<Example> = [
    {
      title: "Exemplos de Entrada",
      dataIndex: "input",
      onCell: () => ({ className: "align-top" }),
      // eslint-disable-next-line react/no-array-index-key
      render: (lines: Example["input"]) => lines.map((line, index) => <pre key={index}>{line}</pre>),
    },
    {
      title: "Exemplos de Saída",
      dataIndex: "output",
      onCell: () => ({ className: "align-top" }),
      render: (lines: Example["output"]) => (
        <div className="min-h-full">
          {lines.map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <pre key={index}>{line}</pre>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Card
      className="card"
      title={<Title level={2}>{data.title}</Title>}
      extra={
        screens.sm ? (
          <Link href={`/submit/${id}`} passHref>
            <Button size="large" type="primary">
              Submeter
            </Button>
          </Link>
        ) : null
      }
      actions={[
        <Link href={`/submit/${id}`} passHref>
          <Button size="large" type="primary">
            Submeter
          </Button>
        </Link>,
      ]}
    >
      <Meta
        description={(
          <Paragraph>
            <TypographyLink href={data.link} target="_blank">
              {id}
            </TypographyLink>
            <br />
            Timelimit: {data.timelimit}
          </Paragraph>
        )}
      />
      <Space direction="vertical">
        <Card type="inner" title="Descrição">
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </Card>
        <Card type="inner" title="Entrada">
          <div dangerouslySetInnerHTML={{ __html: data.input }} />
        </Card>
        <Card type="inner" title="Saída">
          <div dangerouslySetInnerHTML={{ __html: data.output }} />
        </Card>
        <Table<Example>
          size="middle"
          tableLayout="fixed"
          bordered
          columns={columns}
          dataSource={data.examples.map((example, index) => ({
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
