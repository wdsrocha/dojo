import {
 Form, Input, Button, Alert,
} from "antd";
import { useState } from "react";
import { useSession } from "../contexts/auth";

interface LoginFormProps {
  onSuccess?: () => any;
}

interface FormTypes {
  username: string;
  password: string;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<null | number>(null);
  const { login } = useSession();
  const [form] = Form.useForm();

  const onFinish = async ({ username, password }: FormTypes) => {
    setLoading(true);
    setStatusCode(null);

    // TODO: remove on prod
    const newStatusCode = await login(username, password);
    setStatusCode(newStatusCode);
    if (newStatusCode >= 200 && newStatusCode < 300) {
      form.resetFields();
      onSuccess?.();
    }

    setLoading(false);
  };

  return (
    <div>
      {statusCode ? (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message={
            statusCode === 401
              ? "Nome de usuário ou senha inválidos"
              : "Um erro inesperado ocorreu. Por favor, tente novamente"
          }
        />
      ) : null}
      <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }}>
        <Form.Item
          label="Usuário"
          name="username"
          rules={[
            {
              required: true,
              message: "Por favor, insira seu nome de usuário!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
        >
          <Input.Password />
        </Form.Item>
        {/* TODO: uncomment after pre-alpha
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Lembre-me</Checkbox>
          </Form.Item>
          <Hyperlink href="#" className="float-right">
            Esqueci minha senha
          </Hyperlink>
        </Form.Item> */}
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
