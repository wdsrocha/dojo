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

const { Title, Link: TypographyLink } = Typography;

interface Example {
  input: string;
  output: string;
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
          input: "<p>10<br>9</p>",
          output: "<p>X = 19</p>",
        },
        {
          input: "<p>-10<br>4</p>",
          output: "<p>X = -6</p>",
        },
        {
          input: "<p>15<br>-7</p>",
          output: "<p>X = 8</p>",
        },
        {
          input: `<pre id="id0003800066481584352">50
1 2 4 6 6 4 2 1 3 5 5 3 1 2 4 4 2 1 3 3 1 2 2 1 1 1 2 4 6 6 4 2 1 3 5 5 3 1 2 4 4 2 1 3 3 1 2 2 1 1
</pre>`,
          output: "",
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
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
    },
    {
      title: "Exemplos de Saída",
      dataIndex: "output",
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
    },
  ];

  return (
    <Card
      className="card"
      title={<Title level={2}>{data.title}</Title>}
      extra={
        screens.sm ? (
          <Button size="large" type="primary" href={`/submit/?id=${id}`}>
            Submeter
          </Button>
        ) : null
      }
      actions={[
        <Button size="large" type="primary" href={`/submit/?id=${id}`}>
          Submeter
        </Button>,
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
