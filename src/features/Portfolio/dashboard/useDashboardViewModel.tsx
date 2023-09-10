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
import { getEnv } from '../../../lib/envVar';
import { CHAIN } from '../../Contracts/BeefyVault/reads';

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
const YIELD_VAULT_ADDRESS = (
  getEnv('VITE_IS_MAINNET') === 'true' ? getEnv('VITE_MAINNET_REWARDS_CONTRACT_ADDRESS') : getEnv('VITE_TESTNET_REWARDS_CONTRACT_ADDRESS')
) as `0x${string}`;

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
    const hottTokenBalance = hottBalance && rHottDetails ? hottBalance[rHottDetails.hottAddress].balance : 0n;
    const rHottTokenBalance = rHottDetails ? rHottDetails.rHottAccountDetails.unallocatedBalance[rHottDetails.rHottAddress].balance : 0n;
    const totalTokenBalance = hottTokenBalance + rHottTokenBalance;
    const totalAccountBalance = totalTokenBalance + (positionBalance ?? 0n);
    setProperties((properties) => ({
      ...properties,
      totalBalance: getUsdValue(totalAccountBalance).toFixed(2),
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
    console.log(
      'vaultPosition, vaultPosition?.accountDetails, vaultPosition?.accountDetails?.balance',
      vaultPosition,
      vaultPosition?.accountDetails,
      vaultPosition?.accountDetails?.balance,
    );
    if (!vaultPosition || (vaultPosition.accountDetails && vaultPosition.accountDetails.balance != 0n)) {
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
        text: 'HOTT Rewards',
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
    if (!vaultPosition || !vaultPosition.accountDetails) {
      setProperties((properties) => ({
        ...properties,
        showPositions: false,
        vaultPositions: [],
      }));
      return;
    }

    const accountBalance = vaultPosition.accountDetails.balance;

    if (accountBalance === 0n) {
      setProperties((properties) => ({
        ...properties,
        showPositions: false,
        vaultPositions: [],
      }));
      setPositionBalance(0n);
      return;
    }

    setPositionBalance(accountBalance);

    const vaultPositions: VaultPositionCardProps[] = [
      {
        id: vaultPosition.vaultAddress,
        usd: getUsdValue(accountBalance),
        hott: Number(accountBalance / 1000000000000000000n),
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
    if (!rHottDetails || !hottBalance) return;

    const hasUnallocatedRHottBalance = rHottDetails.rHottAccountDetails.unallocatedBalance.hasOwnProperty(rHottDetails.rHottAddress);
    const rHottTokenBalance = hasUnallocatedRHottBalance
      ? rHottDetails.rHottAccountDetails.unallocatedBalance[rHottDetails.rHottAddress].balance
      : 0n;
    const hasUnallocatedHottBalance = hottBalance.hasOwnProperty(rHottDetails.hottAddress);
    const hottTokenBalance = hasUnallocatedHottBalance ? hottBalance[rHottDetails.hottAddress].balance : 0n;
    const totalTokenBalance = hottTokenBalance + rHottTokenBalance;

    if (totalTokenBalance === 0n) {
      if (!isConnected) return;
      setProperties((properties) => ({
        ...properties,
        assetElement: 'buy_token',
        assets: [],
      }));
      return;
    }

    const assets: CardAssetProps[] = [
      {
        usd: getUsdValue(totalTokenBalance),
        token: 'HOTT',
        amount: Number(totalTokenBalance / 1000000000000000000n),
        onClick: undefined,
        name: 'HOTT',
        chain: CHAIN,
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
