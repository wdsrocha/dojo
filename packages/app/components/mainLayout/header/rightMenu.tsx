import { useState } from "react";
import {
 Avatar, Dropdown, Menu, Modal,
} from "antd";
import { MenuProps } from "antd/lib/menu";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/dist/client/router";
import { LoginForm } from "../../LoginForm";
import { useSession } from "../../../contexts/auth";

const User = () => {
  const router = useRouter();
  const { session, logout } = useSession();
  const [modalVisible, setModalVisible] = useState(false);

  if (!session) {
    return (
      <>
        <a
          data-test="login-open"
          className="flex items-center px-5"
          href="#"
          onClick={() => setModalVisible(true)}
        >
          <LoginOutlined style={{ fontSize: 18, marginRight: 8 }} />
          <span>Entrar</span>
        </a>
        <Modal
          centered
          title="Entrar"
          visible={modalVisible}
          footer={null}
          onCancel={() => {
            setModalVisible(false);
          }}
        >
          <LoginForm onSuccess={() => setModalVisible(false)} />
        </Modal>
      </>
    );
  }

  const { username, avatarUrl } = session.user;
  const menu = (
    <Menu
      selectedKeys={[]}
      onClick={async ({ key }) => {
        if (key === "profile") {
          router.push("profile");
        } else if (key === "config") {
          router.push("config");
        } else if (key === "logout") {
          await logout();
        }
      }}
    >
      <Menu.Item key="profile" className="flex items-center">
        <UserOutlined />
        Perfil
      </Menu.Item>
      <Menu.Item key="config" className="flex items-center">
        <SettingOutlined />
        Configurar perfil
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        data-test="user-menu-logout"
        key="logout"
        className="flex items-center"
      >
        <LogoutOutlined />
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown className="px-5" overlay={menu}>
      <span data-test="user-menu" className="inline-block cursor-pointer">
        <Avatar
          size="small"
          className="mr-2"
          alt={`avatar de ${username}`}
          src={avatarUrl}
        >
          {username[0]}
        </Avatar>
        <span>{username}</span>
      </span>
    </Dropdown>
  );
};

export const RightMenu = (props: MenuProps) => (
  <Menu selectedKeys={[]} {...props}>
    <Menu.Item key="user" style={{ padding: 0 }}>
      <User />
    </Menu.Item>
  </Menu>
);
