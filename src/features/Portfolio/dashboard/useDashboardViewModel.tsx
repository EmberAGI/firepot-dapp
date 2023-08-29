import { useEffect, useMemo, useState } from 'react';
import { VaultPositionCardProps } from '../../../components/shared/VaultPositionCard/VaultPositionCard';
import { VaultOpportunityCardProps } from '../../../components/shared/VaultOpportunityCard/VaultOpportunityCard';
import { useNavigate } from 'react-router-dom';
import { CardAssetProps } from '../../../components/shared/CardAsset/CardAsset';
import { useAccount } from 'wagmi';
import { useChainData } from '../../Contracts/BeefyVault/reads';
import { OpportunityData } from '../../futureRelease/SmartDiscovery/types';

interface ViewModelProperties {
  totalBalance: string;
  showLoading: boolean;
  showWalletAddress: boolean;
  showDiscovery: boolean;
  showPositions: boolean;
  assetElement: AssetElement;
  vaultOpportunities: VaultOpportunityCardProps[];
  vaultPositions: VaultPositionCardProps[];
  assets: CardAssetProps[];
  truncatedWalletAddress: string;
}

interface ViewModelCommands {
  connectWallet: () => void;
  buyToken: () => void;
  openVaultOpportunity: (id: string) => void;
  openVaultPosition: (id: string) => void;
}

export interface DashboardViewModel {
  properties: ViewModelProperties;
  commands: ViewModelCommands;
}

export type AssetElement = 'assets' | 'buy_token' | 'connect_wallet';

const initialProperties: ViewModelProperties = {
  totalBalance: '0.00',
  showLoading: true,
  showWalletAddress: false,
  showDiscovery: false,
  showPositions: false,
  assetElement: 'connect_wallet',
  vaultOpportunities: [],
  vaultPositions: [],
  assets: [],
  truncatedWalletAddress: '0x…',
};

//const hottTokenAddress = "";
const rHottTokenAddress = '0xf39e5FCc99565A65953d7ffb195394d968E0f872';

const vaults: OpportunityData[] = [
  {
    id: '0xF893Ee319992B8fB8216CE328b41EF7350651374',
    apy: 0,
    addLiquidityUrl: 'https://launchpad.kommunitas.net/pool/HOTT/PublicCross',
    assets: [rHottTokenAddress],
    platformId: 'n/a',
    strategyTypeId: 'n/a',
    safetyRank: 'high',
    vaultAddress: '0xF893Ee319992B8fB8216CE328b41EF7350651374',
    depositTokenAddress: rHottTokenAddress,
    tokenDecimals: 18,
    pricePerFullShare: 'n/a',
    chain: 'arbitrum-goerli',
  },
];

const hottTokenUsdPrice = 0.005;

export default function useDashboardViewModel(initialState: ViewModelProperties = initialProperties): DashboardViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  const [rHottBalance, setRHottBalance] = useState<bigint | undefined>();
  const [positionBalance, setPositionBalance] = useState<bigint | undefined>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const tokenBalances = useChainData(vaults, 'firepot');

  /*useEffect(() => {
    setTimeout(() => {
      setProperties((properties) => ({
        ...properties,
        showLoading: false,
        showWalletAddress: true,
        truncatedWalletAddress: '0x123…678',
        showDiscovery: true,
        showPositions: true,
        assetElement: 'buy_token',
      }));
    }, 1000);
  }, []);*/

  useEffect(() => {
    if (rHottBalance == null || positionBalance == null) return;

    const totalHottBalance = rHottBalance + positionBalance;
    setProperties((properties) => ({
      ...properties,
      totalBalance: getUsdValue(totalHottBalance).toFixed(2),
    }));
  }, [rHottBalance, positionBalance]);

  useEffect(() => {
    if (isConnected) {
      setProperties((properties) => ({
        ...properties,
        showLoading: false,
        showWalletAddress: true,
        assetElement: 'assets',
        truncatedWalletAddress: address ? `${address.slice(0, 5)}…${address.slice(-3)}` : '0x…',
      }));
    } else {
      setProperties((properties) => ({
        ...properties,
        showLoading: false,
        showWalletAddress: false,
        assetElement: 'connect_wallet',
        truncatedWalletAddress: '0x…',
      }));
    }
  }, [isConnected, tokenBalances]);

  useEffect(() => {
    const opportunities = vaults
      .filter((_, index) => (tokenBalances ? tokenBalances[index].vaultTokenBalance == 0n : true))
      .map((opp, index) => ({
        opportunity: opp,
        tokenBalanceData: tokenBalances
          ? tokenBalances[index]
          : {
              vaultTokenBalance: 0n,
              depositTokenBalance: 0n,
            },
      }));

    if (opportunities.length == 0) {
      setProperties((properties) => ({
        ...properties,
        showDiscovery: false,
        vaultOpportunities: [],
      }));
      return;
    }

    const vaultOpportunities: VaultOpportunityCardProps[] = opportunities.map((opportunity) => ({
      id: opportunity.opportunity.id,
      text: 'HOTT Vault',
      onClick: undefined,
    }));

    setProperties((properties) => ({
      ...properties,
      showDiscovery: true,
      vaultOpportunities,
    }));
  }, [tokenBalances]);

  useEffect(() => {
    if (!tokenBalances) {
      setProperties((properties) => ({
        ...properties,
        showPositions: false,
        vaultPositions: [],
      }));
      return;
    }

    const positions = vaults
      .filter((_, index) => tokenBalances[index].vaultTokenBalance > 0n)
      .map((opp, index) => ({
        opportunity: opp,
        tokenBalanceData: tokenBalances[index],
      }));

    if (positions.length == 0) {
      setProperties((properties) => ({
        ...properties,
        showPositions: false,
        vaultPositions: [],
      }));
      setPositionBalance(0n);
      return;
    }

    setPositionBalance(tokenBalances[0].vaultTokenBalance);

    const vaultPositions: VaultPositionCardProps[] = positions.map((opportunity) => ({
      id: opportunity.opportunity.id,
      usd: getUsdValue(opportunity.tokenBalanceData.vaultTokenBalance),
      hott: Number(opportunity.tokenBalanceData.vaultTokenBalance / 1000000000000000000n),
      onClick: undefined,
    }));

    setProperties((properties) => ({
      ...properties,
      showPositions: true,
      vaultPositions,
    }));
  }, [tokenBalances]);

  useEffect(() => {
    if (!tokenBalances) {
      setProperties((properties) => ({
        ...properties,
        assetElement: 'buy_token',
        assets: [],
      }));
      return;
    }

    const rHottTokens = vaults
      .filter((opp, index) => tokenBalances[index].depositTokenBalance > 0n && opp.depositTokenAddress == rHottTokenAddress)
      .map((opp, index) => ({
        tokenAddress: opp.depositTokenAddress,
        tokenBalance: tokenBalances[index].depositTokenBalance,
      }));

    if (rHottTokens.length == 0) {
      setProperties((properties) => ({
        ...properties,
        assetElement: 'buy_token',
        assets: [],
      }));
      setRHottBalance(0n);
      return;
    }

    setRHottBalance(rHottTokens[0].tokenBalance);

    const assets: CardAssetProps[] = rHottTokens.map((token) => ({
      usd: getUsdValue(token.tokenBalance),
      token: 'HOTT',
      amount: Number(token.tokenBalance / 1000000000000000000n),
      onClick: undefined,
      name: 'HOTT',
      chain: 'arbitrum-goerli',
    }));

    setProperties((properties) => ({
      ...properties,
      assetElement: 'assets',
      assets,
    }));
  }, [tokenBalances]);

  const getUsdValue = (amount: bigint) => {
    return Number(amount / 1000000000000000000n) * hottTokenUsdPrice;
  };

  const connectWallet = () => {};

  const buyToken = () => {
    window.open('https://launchpad.kommunitas.net/pool/HOTT/PublicCross', '_blank');
  };

  const openVaultOpportunity = (id: string) => {
    console.log('openVaultOpportunity', id);
    navigate('yield-vault-deposit');
  };

  const openVaultPosition = (id: string) => {
    console.log('yield-vault', id);
  };

  return {
    properties,
    commands: {
      connectWallet,
      buyToken,
      openVaultOpportunity,
      openVaultPosition,
    },
  };
}
