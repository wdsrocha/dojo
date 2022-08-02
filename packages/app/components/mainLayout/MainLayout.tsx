import Head from "next/head";
import { PropsWithChildren } from "react";
import { Layout } from "antd";
import Link from "antd/lib/typography/Link";
import { Header } from "./header/Header";

export const MainLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen">
    <Head>
      <title>DOJO Online Judge Orchestrator</title>
      <link rel="stylesheet" href="/favicon.ico" />
    </Head>
    <main className="min-h-screen">
      <Layout className="min-h-screen">
        <Header />
        <Layout.Content
          className="md:mt-3 md:mb-4 mx-auto"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          {children}
        </Layout.Content>
        <Layout.Footer className="text-center mb-3">
          DOJO © 2020-2021{" "}
          <Link href="https://github.com/wdsrocha">Wesley Rocha</Link>
        </Layout.Footer>
      </Layout>
    </main>
  </div>
);
