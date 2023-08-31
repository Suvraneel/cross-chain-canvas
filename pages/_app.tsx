import "../styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig, createConfig } from "wagmi";
import { fantomTestnet, avalancheFuji, polygonMumbai } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Layout from "../components/Layout";

const config = createConfig(
  getDefaultConfig({
    appName: "ConnectKit Next.js demo",
    //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [polygonMumbai, avalancheFuji, fantomTestnet],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider debugMode>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
