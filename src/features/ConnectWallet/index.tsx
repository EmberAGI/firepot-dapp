import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { JSX } from 'react';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

type Props = { children: JSX.Element | JSX.Element[] };

export default function ConnectWalletConfig({ children }: Props) {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
      // COMMENTS LEGEND: If there is a list, that is the order in which the networks are used.
      //      If there is a blank line, we default to using the default/public RPC.
      arbitrum, // Alchemy, (Infura paid add-on), Ankr
      arbitrumGoerli, // Alchemy, (Infura paid add-on), Ankr
      //aurora, // Infura
      // avalanche, // Infura, Ankr
      // bsc, // Ankr
      //canto, //
      //celo, // Infura, Ankr
      //cronos, //
      // fantom, // Ankr
      // mainnet, // Alchemy
      //metis, // Ankr
      //moonbeam, // Ankr
      //moonriver, //
      // optimism, // Alchemy, (Infura paid add-on)
      // polygon, // Alchemy, (Infura paid add-on)
      //zkSync, //
      // fuse,        TODO(AVK): Not urgent. Create custom chain
      // kava,        TODO(AVK): Not urgent. Create custom chain
      // emerald,     TODO(AVK): Not urgent. Create custom chain
    ],
    [
      alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_KEY! }),
      infuraProvider({ apiKey: import.meta.env.VITE_INFURA_KEY! }),
      jsonRpcProvider({
        rpc: (chain) => {
          const apiKey = import.meta.env.VITE_ANKR_KEY!;
          switch (chain.id) {
            case arbitrum.id:
              return { http: `https://rpc.ankr.com/arbitrum/${apiKey}` };
            case arbitrumGoerli.id:
              return { http: 'https://goerli-rollup.arbitrum.io/rpc' };
            /*case avalanche.id:
              return { http: `https://rpc.ankr.com/avalanche/${apiKey}` };
            case bsc.id:
              return { http: `https://rpc.ankr.com/bsc/${apiKey}` };
            case celo.id:
              return { http: `https://rpc.ankr.com/celo/${apiKey}` };
            case fantom.id:
              return { http: `https://rpc.ankr.com/fantom/${apiKey}` };
            case metis.id:
              return { http: `https://rpc.ankr.com/metis/${apiKey}` };
            case moonbeam.id:
              return { http: `https://rpc.ankr.com/moonbeam/${apiKey}` };*/
          }
          // if chain is not valid, move to next provider
          return null;
        },
      }),
      publicProvider(),
    ],
  );

  const { connectors } = getDefaultWallets({
    appName: 'Firepot Finance',
    chains,
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
    // TODO: What does this do? storage: createStorage({ storage: window.localStorage }),
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize='compact' chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export function ConnectWallet() {
  return <ConnectButton />;
}
