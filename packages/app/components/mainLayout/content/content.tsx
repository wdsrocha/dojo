import { FC } from "react";
import { Layout } from "antd";

const Content: FC = ({ children }) => (
  <Layout.Content style={{ width: '100%', maxWidth: '1200px', margin: '24px auto 16px' }}>{children}</Layout.Content>
);

export default Content;
