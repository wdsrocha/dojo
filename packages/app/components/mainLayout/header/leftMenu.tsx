import { FC } from "react";
import { Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import { Hyperlink } from "../../Hyperlink";

export const LeftMenu: FC<MenuProps> = (props) => (
  <Menu {...props} selectable={false}>
    <Menu.Item key="home">
      <Hyperlink href="/">
        Home
      </Hyperlink>
    </Menu.Item>
    <Menu.Item key="problem">
      <Hyperlink data-test="nav-problem" href="/problem">
        Problemas
      </Hyperlink>
    </Menu.Item>
  </Menu>
);
