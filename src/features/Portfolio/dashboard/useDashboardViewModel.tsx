import { useEffect, useState } from 'react';
import { VaultPositionCardProps } from '../../../components/shared/VaultPositionCard/VaultPositionCard';
import { VaultOpportunityCardProps } from '../../../components/shared/VaultOpportunityCard/VaultOpportunityCard';
import { useNavigate } from 'react-router-dom';
import { CardAssetProps } from '../../../components/shared/CardAsset/CardAsset';
import { useAccount } from 'wagmi';
//import { useChainData } from '../../Contracts/BeefyVault/reads';
//import { OpportunityData } from '../../futureRelease/SmartDiscovery/types';
import { useVaultPosition } from '../../Contracts/FirepotVault/useVaultPosition';
import { useRHottDetails } from '../../Contracts/FirepotVault/useRHottDetails';
import { useTokenBalance } from '../../Contracts/FungibleTokens/useTokenBalance';

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
//const rHottTokenAddress = '0xf39e5FCc99565A65953d7ffb195394d968E0f872';

/*const vaults: OpportunityData[] = [
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
];*/

const hottTokenUsdPrice = 0.005;
const YIELD_VAULT_ADDRESS = '0xe3dc90C119c46d77659CBbc5f470159A3385ad74';

export default function useDashboardViewModel(initialState: ViewModelProperties = initialProperties): DashboardViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  //const [rHottBalance, setRHottBalance] = useState<bigint | undefined>();
  const [positionBalance, setPositionBalance] = useState<bigint | undefined>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  //const tokenBalances = useChainData(vaults, 'firepot');
  const vaultPosition = useVaultPosition(YIELD_VAULT_ADDRESS);
  const rHottDetails = useRHottDetails();
  const hottBalance = useTokenBalance(rHottDetails?.hottAddress);

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
    if (!rHottDetails || hottBalance == null || !hottBalance[rHottDetails.hottAddress].balance || positionBalance == null) return;

    const tokenBalance = hottBalance[rHottDetails.hottAddress].balance;
    const totalHottBalance = tokenBalance + positionBalance;
    setProperties((properties) => ({
      ...properties,
      totalBalance: getUsdValue(totalHottBalance).toFixed(2),
    }));
  }, [rHottDetails, hottBalance, positionBalance]);

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
  }, [isConnected]);

  useEffect(() => {
    if (!vaultPosition || vaultPosition.balance) {
      setProperties((properties) => ({
        ...properties,
        showDiscovery: false,
        vaultOpportunities: [],
      }));
      return;
    }

    const vaultOpportunities: VaultOpportunityCardProps[] = [
      {
        id: vaultPosition.vaultAddress,
        text: 'HOTT Vault',
        APY: Number(vaultPosition.apy),
        onClick: undefined,
      },
    ];

    setProperties((properties) => ({
      ...properties,
      showDiscovery: true,
      vaultOpportunities,
    }));
  }, [vaultPosition]);

  useEffect(() => {
    if (!vaultPosition) {
      setProperties((properties) => ({
        ...properties,
        showPositions: false,
        vaultPositions: [],
      }));
      return;
    }

    if (vaultPosition.balance === 0n) {
      setProperties((properties) => ({
        ...properties,
        showPositions: false,
        vaultPositions: [],
      }));
      setPositionBalance(0n);
      return;
    }

    setPositionBalance(vaultPosition.balance);

    const vaultPositions: VaultPositionCardProps[] = [
      {
        id: vaultPosition.vaultAddress,
        usd: getUsdValue(vaultPosition.balance),
        hott: Number(vaultPosition.balance / 1000000000000000000n),
        onClick: undefined,
        APY: Number(vaultPosition.apy),
      },
    ];

    setProperties((properties) => ({
      ...properties,
      showPositions: true,
      vaultPositions,
    }));
  }, [vaultPosition]);

  useEffect(() => {
    if (!rHottDetails || !hottBalance || !hottBalance[rHottDetails.hottAddress].balance) {
      if (!isConnected) return;
      setProperties((properties) => ({
        ...properties,
        assetElement: 'buy_token',
        assets: [],
      }));
      return;
    }

    const rHottBalance = rHottDetails.rHottAccountDetails.unallocatedBalance.hasOwnProperty(rHottDetails.hottAddress)
      ? rHottDetails.rHottAccountDetails.unallocatedBalance[rHottDetails.hottAddress].balance
      : 0n;
    const tokenBalance = hottBalance[rHottDetails.hottAddress].balance + rHottBalance;
    const assets: CardAssetProps[] = [
      {
        usd: getUsdValue(tokenBalance),
        token: 'HOTT',
        amount: Number(tokenBalance / 1000000000000000000n),
        onClick: undefined,
        name: 'HOTT',
        chain: 'arbitrum-goerli',
      },
    ];

    setProperties((properties) => ({
      ...properties,
      assetElement: 'assets',
      assets,
    }));
  }, [rHottDetails, hottBalance]);

  const getUsdValue = (amount: bigint) => {
    return Number(amount / 1000000000000000000n) * hottTokenUsdPrice;
  };

  const connectWallet = () => {};

  const buyToken = () => {
    window.open('https://firepot.finance/sale', '_blank');
  };

  const openVaultOpportunity = (id: string) => {
    console.log('openVaultOpportunity', id);
    navigate('/yield-vault-deposit');
  };

  const openVaultPosition = (id: string) => {
    console.log('yield-vault', id);
    navigate('/yield-vault');
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
