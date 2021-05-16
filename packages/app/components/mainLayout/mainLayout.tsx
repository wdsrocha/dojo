import Head from "next/head";
import { FC } from "react";
import { Layout } from "antd";
import { Header } from "./header/Header";

export const MainLayout: FC = ({ children }) => (
  <div>
    <Head>
      <title>DOJO Online Judge Orchestrator</title>
      <link rel="stylesheet" href="/favicon.ico" />
    </Head>
    <main>
      <Layout>
        <Header />
        <Layout.Content
          className="md:mt-3 md:mb-4 mx-auto"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          {children}
        </Layout.Content>
        <Layout.Footer className="text-center">
          DOJO © 2020-2021 Wesley Rocha
        </Layout.Footer>
      </Layout>
    </main>
  </div>
);
