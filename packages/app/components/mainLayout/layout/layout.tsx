import { FC } from "react";
import { Layout as AntLayout } from "antd";
import { LayoutProps } from "antd/lib/layout";

const Layout: FC<LayoutProps> = (props) => <AntLayout {...props} />;

export default Layout;
