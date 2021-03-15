/* eslint-disable react/no-danger */
import {
 Button, Card, Table, Typography,
} from "antd";
import Meta from "antd/lib/card/Meta";
import Column from "antd/lib/table/Column";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import Paragraph from "antd/lib/typography/Paragraph";

const { Title, Link: TypographyLink } = Typography;

export const getServerSideProps = async () => ({
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
          key: 1,
          input: "<p>10<br>9</p>",
          output: "<p>X = 19</p>",
        },
        {
          key: 2,
          input: "<p>-10<br>4</p>",
          output: "<p>X = -6</p>",
        },
        {
          key: 3,
          input: "<p>15<br>-7</p>",
          output: "<p>X = 8</p>",
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

  return (
    <Card
      title={<Title level={2}>{data.title}</Title>}
      extra={(
        <Button size="large" type="primary" href={`/submit/?id=${id}`}>
          Submeter
        </Button>
      )}
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
      <Card style={{ marginTop: 16 }} type="inner" title="Descrição">
        <div dangerouslySetInnerHTML={{ __html: data.description }} />
      </Card>
      <Card
        style={{
          marginTop: 16,
        }}
        type="inner"
        title="Entrada"
      >
        <div dangerouslySetInnerHTML={{ __html: data.input }} />
      </Card>
      <Card
        style={{
          marginTop: 16,
        }}
        type="inner"
        title="Saída"
      >
        <div dangerouslySetInnerHTML={{ __html: data.output }} />
      </Card>
      <Table
        size="small"
        style={{ marginTop: 16 }}
        dataSource={data.examples}
        pagination={{ hideOnSinglePage: true }}
      >
        <Column
          title="Exemplos de Entrada"
          dataIndex="input"
          key="input"
          render={(input) => (
            <div dangerouslySetInnerHTML={{ __html: input }} />
          )}
        />
        <Column
          title="Exemplos de Saída"
          dataIndex="output"
          key="output"
          render={(output) => (
            <div dangerouslySetInnerHTML={{ __html: output }} />
          )}
        />
      </Table>
    </Card>
  );
};

export default Problem;
