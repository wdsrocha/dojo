import { FC, useState } from "react";
import {
 Form, Button, Select, Input, Card,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 2 },
};

const tailLayout = {
  wrapperCol: { offset: 2, span: 8 },
};

export const SubmissionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="card" title={<Title level={1}>Enviar</Title>}>
      <Form
        {...layout}
        name="submit"
        validateMessages={{ required: "Campo obrigatório" }}
        onFinish={async (values) => {
          setIsLoading(true);
          try {
            const response = await fetch("/api/submit", {
              method: "POST",
              body: JSON.stringify(values),
            });
            // eslint-disable-next-line no-console
            console.log(JSON.stringify(await response.json(), null, 2));
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <Item label="Problema">Teste</Item>
        <Item name="language" label="Linguagem">
          <Select showSearch>
            <Option value="cpp">C++</Option>
            <Option value="python">Python</Option>
          </Select>
        </Item>
        <Item name="code" label="Código">
          <TextArea rows={16} />
        </Item>
        <Item {...tailLayout}>
          <Button
            className="flex items-center"
            icon={<SendOutlined />}
            htmlType="submit"
            type="primary"
            loading={isLoading}
          >
            Enviar
          </Button>
        </Item>
      </Form>
    </Card>
  );
};
