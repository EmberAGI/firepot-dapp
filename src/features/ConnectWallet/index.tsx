import '@rainbow-me/rainbowkit/styles.css';
import {
    ConnectButton,
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
    mainnet,
    polygon,
    bsc,
    optimism,
    fantom,
    arbitrum,
    avalanche,
    cronos,
    moonbeam,
    moonriver,
    metis,
    // fuse, TODO(AVK): Create custom chain
    // kava, TODO(AVK): Create custom chain
    canto,
    zkSync,
    aurora,
    // emerald, TODO(AVK): Create custom chain
    celo
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { JSX } from 'react';

type Props = { children: JSX.Element | JSX.Element[] };

export default function ConnectWalletConfig({ children }: Props) {
    const { chains, publicClient } = configureChains(
        [mainnet, polygon, bsc, optimism, fantom, arbitrum,
            avalanche, cronos, moonbeam, moonriver, metis,
            // fuse, TODO(AVK): Create custom chain
            // kava, TODO(AVK): Create custom chain
            canto, zkSync, aurora,
            // emerald, TODO(AVK): Create custom chain
            celo
        ],
        [
            alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_KEY! }),
            // TODO(AVK): Add extra providers for other chains
            publicProvider()
        ]
    );
    const { connectors } = getDefaultWallets({
        appName: 'FirePot Finance',
        chains,
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    });
    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors,
        publicClient
    });

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export function ConnectWallet() {
    return (<ConnectButton />)
}
