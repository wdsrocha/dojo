import { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import { start, done } from "nprogress";
import "nprogress/nprogress.css";
import { Router } from "next/dist/client/router";

import { MainLayout } from "../components/mainLayout/MainLayout";
import "../styles/globals.css";
import { AuthProvider } from "../contexts/auth";

const App = ({ Component, pageProps }: AppProps) => {
  Router.events.on("routeChangeStart", start);
  Router.events.on("routeChangeComplete", done);
  Router.events.on("routeChangeError", done);

  return (
    <ConfigProvider locale={ptBR}>
      <AuthProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
