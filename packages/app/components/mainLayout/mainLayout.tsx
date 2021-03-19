import Head from "next/head";
import { FC } from "react";
import Layout from "./layout";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";

const MainLayout: FC = ({ children }) => (
  <div>
    <Head>
      <title>DOJO Online Judge Orchestrator</title>
      <link rel="stylesheet" href="/favicon.ico" />
    </Head>
    <main>
      <Layout>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Layout>
    </main>
  </div>
);

export default MainLayout;
