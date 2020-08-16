import React, { FC } from "react";
import { Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import Link from "next/link";

const RightMenu: FC<MenuProps> = (props) => (
  <Menu {...props}>
    <Menu.Item key="log-in">
      <Link href="/login">
        <a>Entrar</a>
      </Link>
    </Menu.Item>
    <Menu.Item key="sign-up">
      <Link href="/register">
        <a>Cadastrar</a>
      </Link>
    </Menu.Item>
  </Menu>
);

export default RightMenu;
