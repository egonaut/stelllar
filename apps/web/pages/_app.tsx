import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import Head from "next/head";
import apolloClient from "../apollo-client";
import MainLayout from "../src/layouts/MainLayout";
import "../src/styles/global.css";
import "../src/styles/index.css";
import "../src/styles/tippy.css";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Stelllar – Forum & Chat for Communities</title>
      </Head>
      <main className="app">
        <ApolloProvider client={apolloClient}>
          <SessionProvider session={session}>
            <div style={{ height: "100%" }} className="flex">
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </div>
          </SessionProvider>
        </ApolloProvider>
      </main>
    </>
  );
}

export default appWithTranslation(App);
