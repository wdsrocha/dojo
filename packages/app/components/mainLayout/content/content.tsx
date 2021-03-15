import { FC } from "react";
import { Layout } from "antd";

const Content: FC = ({ children }) => (
  <Layout.Content className="md:px-16 px-6 pt-6">{children}</Layout.Content>
);

export default Content;
