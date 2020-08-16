import React from "react";
import { AppProps } from "next/app";

import MainLayout from "../components/mainLayout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
