import { GithubOutlined } from "@ant-design/icons";
import {
 Alert, Card, Col, Row,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import Link from "antd/lib/typography/Link";
import { Hyperlink } from "../components/Hyperlink";

const Home = () => (
  <>
    <Row justify="center" gutter={[16, 16]}>
      <Col md={{ span: 16 }}>
        <Alert
          banner
          closable
          type="warning"
          message="Estamos em fase de desenvolvimento. O site pode não funcionar como o esperado."
        />
      </Col>
    </Row>
    <Row justify="center" gutter={[16, 16]} className="mt-4">
      <Col md={{ span: 16 }}>
        <Card
          className="card"
          title={(
            <span className="text-center block -mb-4 whitespace-pre-line">
              <Title level={1}>DOJO Orquestrador de Juiz Online</Title>
            </span>
          )}
        >
          <Paragraph>
            O DOJO facilita o treinamento para competições de programação ao
            reunir seus juizes onlines favoritos em um só lugar. Escolha um
            problema, leia o enuciado, submeta a solução e receba seu veredito.
          </Paragraph>
          <Hyperlink href="/problem">
            Comece a treinar<span className="ml-2">&#8594;</span>
          </Hyperlink>
        </Card>
      </Col>
    </Row>
    <Row justify="center" gutter={[16, 16]} className="mt-4">
      <Col md={{ span: 8 }} flex="auto">
        <Card className="card" title="Juizes suportados">
          <Paragraph>
            <ul>
              <li>
                <Link href="https://urionlinejudge.com.br/">
                  URI Online Judge
                </Link>
              </li>
            </ul>
            <p>Em breve...</p>
            <ul>
              <li>
                <Link href="https://vjudge.net/">VJudge</Link>
              </li>
              <li>
                <Link href="https://cses.fi/">CSES</Link>
              </li>
            </ul>
          </Paragraph>
        </Card>
      </Col>
      <Col md={{ span: 8 }} flex="auto">
        <Card
          className="card min-h-full"
          title={<i>Open-source software</i>}
          extra={(
            <a aria-label="GitHub icon" href="https://github.com/wdsrocha/dojo">
              <GithubOutlined style={{ fontSize: 22 }} />
            </a>
          )}
        >
          <Paragraph>
            DOJO é <i>OSS</i>! Acompanhe e contribua com o projeto{" "}
            <Link href="https://github.com/wdsrocha/dojo">
              no repositório do GitHub
            </Link>
            .
          </Paragraph>
        </Card>
      </Col>
    </Row>
  </>
);

export default Home;
