import { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import { start, done } from "nprogress";
import "nprogress/nprogress.css";
import { Router } from "next/dist/client/router";

import MainLayout from "../components/mainLayout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  Router.events.on("routeChangeStart", start);
  Router.events.on("routeChangeComplete", done);
  Router.events.on("routeChangeError", done);

  return (
    <ConfigProvider locale={ptBR}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ConfigProvider>
  );
}

export default MyApp;
