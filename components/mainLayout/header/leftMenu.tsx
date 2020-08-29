import React, { FC } from "react";
import { Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import Link from "next/link";

const LeftMenu: FC<MenuProps> = (props) => (
  <Menu {...props} selectable={false}>
    <Menu.Item key="home">
      <Link href="/">
        <a>Home</a>
      </Link>
    </Menu.Item>
    <Menu.Item key="submit">
      <Link href="/submit">
        <a>Submeter</a>
      </Link>
    </Menu.Item>
  </Menu>
);

export default LeftMenu;
