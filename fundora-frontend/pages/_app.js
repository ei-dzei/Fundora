import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  WagmiConfig,
  createConfig,
  configureChains,
} from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  sepolia,          // 👈 add Sepolia
  // baseSepolia,    // 👈 uncomment if you plan to support Base Sepolia later
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";

const { chains, publicClient } = configureChains(
  [sepolia, mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Fundora",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const rkTheme = useMemo(() => {
    return darkTheme({
      accentColor: "#14e1c1",          
      accentColorForeground: "#071a1b",
      borderRadius: "large",
      overlayBlur: "small",
    });
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          initialChain={sepolia}     
          modalSize="compact"
          theme={rkTheme}
          appInfo={{
            appName: "Fundora",
          }}
        >
          {/* App background wrapper for consistent theme */}
          <div className="min-h-screen bg-[#071a1b] text-white antialiased">
            <Component {...pageProps} />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
