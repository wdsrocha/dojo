import { useState } from "react";
import {
 Form, Button, Select, Input, Card, Modal,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useRouter } from "next/dist/client/router";

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

interface FormTypes {
  language: string;
  code: string;
}

interface Props {
  onlineJudgeId: string;
  remoteProblemId: string;
  title: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SubmissionForm = ({ onlineJudgeId, remoteProblemId, title }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFinish = async ({ language, code }: FormTypes) => {
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions`,
      {
        method: "POST",
        credentials: "include",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          onlineJudgeId,
          problemId: remoteProblemId,
          languageId: "20",
          code,
        }),
      },
    );

    if (!response.ok) {
      console.log({ response });
      if (response.status === 401) {
        Modal.error({
          title: "Permissão negada",
          content: "Entre na sua conta para submeter.",
        });
      } else {
        Modal.error({
          title: "Desculpe, um erro inesperado ocorreu",
          content: "Por favor, tente novamente.",
        });
      }
      setLoading(false);
      return
    }

    const data = await response.json();

    console.log({ data });

    router.push(`/submission/${data.id}`)

    setLoading(false);
  };

  return (
    <Card className="card" title={<Title level={1}>Enviar</Title>}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        name="submit"
        validateMessages={{ required: "Campo obrigatório" }}
        onFinish={handleFinish}
      >
        <Item label="Problema">{`${onlineJudgeId.toUpperCase()} - ${remoteProblemId} - ${title}`}</Item>
        <Item name="language" label="Linguagem" wrapperCol={{ span: 4 }}>
          <Select>
            <Option value="cpp">C++</Option>
            <Option value="python">Python</Option>
          </Select>
        </Item>
        <Item name="code" label="Código">
          <TextArea rows={16} />
        </Item>
        <Item wrapperCol={{ sm: { offset: 4 } }}>
          <Button
            icon={<SendOutlined />}
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Enviar
          </Button>
        </Item>
      </Form>
    </Card>
  );
};
