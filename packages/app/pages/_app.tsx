import React from "react";
import { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";

import MainLayout from "../components/mainLayout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={ptBR}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ConfigProvider>
  );
}

export default MyApp;
