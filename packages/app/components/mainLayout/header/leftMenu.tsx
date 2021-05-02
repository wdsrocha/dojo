import { FC } from "react";
import { Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import { Hyperlink } from "../../Hyperlink";

const LeftMenu: FC<MenuProps> = (props) => (
  <Menu {...props} selectable={false}>
    <Menu.Item key="home">
      <Hyperlink href="/">
        Home
      </Hyperlink>
    </Menu.Item>
    <Menu.Item key="problem">
      <Hyperlink href="/problem">
        Problemas
      </Hyperlink>
    </Menu.Item>
    <Menu.Item key="submit">
      <Hyperlink href="/submit">
        Submeter
      </Hyperlink>
    </Menu.Item>
  </Menu>
);

export default LeftMenu;
