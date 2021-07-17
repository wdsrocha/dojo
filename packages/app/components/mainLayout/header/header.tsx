import { useState } from "react";
import { Drawer, Button, Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { LeftMenu } from "./LeftMenu";
import { RightMenu } from "./RightMenu";

export const Header = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  return (
    <Layout.Header className="flex justify-center px-0">
      <div
        className="flex items-center"
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <div className="mx-5 flex flex-1">
          <Link href="/">
            <a className="flex text-3xl font-bold text-white">
              <span role="img" aria-label="DOJO Logo">
                🥋
              </span>
              <span className="ml-2 text-lg">DOJO</span>
            </a>
          </Link>
        </div>
        <nav className="hidden md:flex md:items-center md:justify-between md:w-full">
          <LeftMenu mode="horizontal" theme="dark" />
          <RightMenu mode="horizontal" theme="dark" />
        </nav>
        <Button
          className="md:hidden flex items-center justify-center mr-5"
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setIsDrawerVisible(true)}
        />
        <Drawer
          title="Menu"
          placement="right"
          closable={false}
          onClose={() => setIsDrawerVisible(false)}
          visible={isDrawerVisible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </Layout.Header>
  );
};
