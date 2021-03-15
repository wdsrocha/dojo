import { FC, useState } from 'react';
import {
 Form, Button, Select, Input,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { Item } = Form;
const { Option } = Select;
const { TextArea, Group } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 8 },
};

const Submitter: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Form
      {...layout}
      name="submit"
      validateMessages={{ required: 'Campo obrigatório' }}
      onFinish={async (values) => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/submit', {
            method: 'POST',
            body: JSON.stringify(values),
          });
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(await response.json(), null, 2));
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <Item label="Problema">
        <Group compact>
          <Item name={['problem', 'oj']} noStyle>
            <Select
              showSearch
              placeholder="Filtre por um OJ"
              style={{ width: '30%' }}
            >
              <Option value="codeforces">Codeforces</Option>
              <Option value="uva">UVA</Option>
              <Option value="uri">URI</Option>
            </Select>
          </Item>
          <Item
            name={['problem', 'id']}
            noStyle
            rules={[{ required: true, message: 'Escolha um problema' }]}
          >
            <Select
              style={{ width: '70%' }}
              showSearch
              placeholder="Nome ou ID do problema"
            >
              <Option value="1001">Extremamente Básico</Option>
              <Option value="002">Hello</Option>
              <Option value="003">World</Option>
              <Option value="004">Herld</Option>
              <Option value="005">Hd</Option>
              <Option value="006">Hellorld</Option>
            </Select>
          </Item>
        </Group>
      </Item>
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
  );
};

export default Submitter;
