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
    <Menu.Item key="problems">
      <Link href="/problems">
        <a>Problemas</a>
      </Link>
    </Menu.Item>
    <Menu.Item key="contests">
      <Link href="/contests">
        <a>Competições</a>
      </Link>
    </Menu.Item>
  </Menu>
);

export default LeftMenu;
