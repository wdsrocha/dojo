import { FC } from "react";
import { Layout } from "antd";

const Content: FC = ({ children }) => (
  <Layout.Content className="md:mt-3 md:mb-4 mx-auto" style={{ width: '100%', maxWidth: '1200px' }}>{children}</Layout.Content>
);

export default Content;
