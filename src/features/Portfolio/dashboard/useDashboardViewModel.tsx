import { useEffect, useState } from 'react';
import { VaultPositionCardProps } from '../../../components/shared/VaultPositionCard/VaultPositionCard';
import { VaultOpportunityCardProps } from '../../../components/shared/VaultOpportunityCard/VaultOpportunityCard';
import { useNavigate } from 'react-router-dom';
import { CardAssetProps } from '../../../components/shared/CardAsset/CardAsset';

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
  totalBalance: '0',
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

export default function useDashboardViewModel(initialState: ViewModelProperties = initialProperties): DashboardViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  const navigate = useNavigate();
  /*const { userStakeBalance, stake } = useYieldFarmUserPosition(yieldFarmContractAddress);
  const { stakingTokenAddress } = useYieldFarmState(yieldFarmContractAddress);
  const { userBalance: stakingTokenUserBalance, decimals: stakingTokenDecimals } = useERC20Token(stakingTokenAddress);
  const [stakeAmount, setStakeAmount] = useState<string | undefined>();
  const { approvalRequired, isApproved, pendingApproval, approve } = useTokenApproval(
    stakeAmount,
    stakingTokenAddress,
    yieldFarmContractAddress
  );*/

  useEffect(() => {
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
  }, []);

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

  /*useEffect(() => {
    setViewModel((viewModel) => ({
      ...viewModel,
      unstakedTokens: stakingTokenUserBalance
        ? Number(formatUnits(stakingTokenUserBalance, stakingTokenDecimals)).toFixed(8).toString()
        : '0',
    }));
  }, [stakingTokenDecimals, stakingTokenUserBalance]);

  useEffect(() => {
    setViewModel((viewModel) => ({
      ...viewModel,
      stakedTokens: Number(formatUnits(userStakeBalance, stakingTokenDecimals)).toFixed(8).toString(),
    }));
  }, [stakingTokenDecimals, userStakeBalance]);*/

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
