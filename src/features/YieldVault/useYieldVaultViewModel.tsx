import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

interface TransactionPreview {
  tokenSymbol: string;
  stableSymbol: string;
  subtotalTokenAmount: string;
  subtotalStableAmount: string;
  penaltyTokenAmount: string;
  penaltyStableAmount: string;
  feesTokenAmount: string;
  feesStableAmount: string;
  totalTokenAmount: string;
  totalStableAmount: string;
}

type VaultTab = 'deposit' | 'withdraw';
type ActionLabel = 'Deposit' | 'Withdraw';

interface VaultReturn {
  tokenReturn: string;
  returnPercentage: string;
}

interface ViewModelProperties {
  vaultStableBalance: string;
  availableStableBalance: string;
  stableSymbol: string;
  vaultTokenBalance: string;
  availableTokenBalance: string;
  tokenSymbol: string;
  showLoading: boolean;
  showTransactionPreview: boolean;
  transactionPreview?: TransactionPreview;
  vaultTab: VaultTab;
  actionLabel: ActionLabel;
  moveTokenAmount: string;
  moveTokenPercentage: number;
  apy: string;
  vaultReturn: VaultReturn;
  showActionButton: boolean;
}

interface ViewModelCommands {
  switchVaultTab: (tab: VaultTab) => void;
  updateMoveStableAmount: (amount: string) => void;
  deposit: (vaultAddress: string) => void;
  withdraw: (vaultAddress: string) => void;
}

export interface YieldVaultViewModel {
  properties: ViewModelProperties;
  commands: ViewModelCommands;
}

const initialProperties: ViewModelProperties = {
  vaultStableBalance: '5.00',
  availableStableBalance: '2.50',
  stableSymbol: 'USD',
  vaultTokenBalance: '1000.00',
  availableTokenBalance: '500.00',
  tokenSymbol: 'HOTT',
  showLoading: true,
  showTransactionPreview: false,
  vaultTab: 'deposit',
  actionLabel: 'Deposit',
  moveTokenAmount: '0',
  moveTokenPercentage: 0,
  apy: '20.44',
  vaultReturn: {
    tokenReturn: '0.00',
    returnPercentage: '0.00',
  },
  showActionButton: false,
};

const HOTT_TOKEN_PRICE = 0.005;

export default function useDashboardViewModel(initialState: ViewModelProperties = initialProperties): YieldVaultViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  const [moveStableAmount, setMoveStableAmount] = useState<string>('0');
  //const navigate = useNavigate();
  //const { address, isConnected } = useAccount();
  //const tokenBalances = useChainData(vaults, 'firepot');

  useEffect(() => {
    setTimeout(() => {
      setProperties((properties) => ({
        ...properties,
        showLoading: false,
      }));
    }, 1000);
  }, []);

  const switchVaultTab = (tab: VaultTab) => {
    setProperties((properties) => ({
      ...properties,
      vaultTab: tab,
      actionLabel: tab == 'deposit' ? 'Deposit' : 'Withdraw',
    }));
  };

  const updateMoveStableAmount = (amount: string) => {
    if (!amount) {
      setMoveStableAmount('0');
      setProperties((properties) => ({
        ...properties,
        moveTokenAmount: '0',
        moveTokenPercentage: 0,
        showActionButton: false,
        showTransactionPreview: false,
      }));

      return;
    }

    const percentageDecimal = Number(amount) / Number(properties.availableStableBalance);
    const moveTokenAmount = String(Number(properties.availableTokenBalance) * percentageDecimal);
    const transactionPreview = {
      tokenSymbol: properties.tokenSymbol,
      stableSymbol: properties.stableSymbol,
      subtotalTokenAmount: moveTokenAmount,
      subtotalStableAmount: amount,
      penaltyTokenAmount: '0',
      penaltyStableAmount: '0',
      feesTokenAmount: '0',
      feesStableAmount: '0',
      totalTokenAmount: moveTokenAmount,
      totalStableAmount: amount,
    };

    setMoveStableAmount(amount);
    setProperties((properties) => ({
      ...properties,
      moveTokenAmount,
      moveTokenPercentage: percentageDecimal * 100,
      showActionButton: true,
      showTransactionPreview: true,
      transactionPreview,
    }));
  };

  const deposit = (vaultAddress: string) => {};

  const withdraw = (vaultAddress: string) => {};

  return {
    properties,
    commands: {
      switchVaultTab,
      updateMoveStableAmount,
      deposit,
      withdraw,
    },
  };
}
