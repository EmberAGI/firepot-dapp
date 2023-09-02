import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useToken } from 'wagmi';
import { useVaultPosition } from '../Contracts/FirepotVault/useVaultPosition';
import { useTokenBalance } from '../Contracts/FungibleTokens/useTokenBalance';

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

//const HOTT_TOKEN_PRICE = 0.005;

export default function useYieldVaultViewModel(address: `0x${string}`, initialState: ViewModelProperties = initialProperties): YieldVaultViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  const [depositTokenAddress, setDepositTokenAddress] = useState<`0x${string}` | undefined>();
  const [moveStableAmount, setMoveStableAmount] = useState<string>('0');
  const vaultPosition = useVaultPosition(address);
  const tokenBalance = useTokenBalance(depositTokenAddress);

  useEffect(() => {
    setTimeout(() => {
      setProperties((properties) => ({
        ...properties,
        showLoading: false,
      }));
    }, 1000);
  }, []);

  useEffect(() => {
    if (!vaultPosition) {
      return;
    }

    setDepositTokenAddress(vaultPosition.depositTokenAddress);
  }, [vaultPosition]);

  useEffect(() => {
    if (!vaultPosition) {
      return;
    }

    console.log('vaultPosition', vaultPosition);

    setProperties((properties) => ({
      ...properties,
      vaultStableBalance: String(
        vaultPosition.priceDenominationBalance /
          BigInt(10 ** vaultPosition.priceDenominationDecimals) /
          BigInt(10 ** vaultPosition.depositTokenDecimals),
      ),
      stableSymbol: vaultPosition.priceDenominationSymbol,
      vaultTokenBalance: String(vaultPosition.balance / BigInt(10 ** vaultPosition.depositTokenDecimals)),
      apy: vaultPosition.apy,
    }));
  }, [vaultPosition]);

  useEffect(() => {
    if (!tokenBalance || !vaultPosition || !tokenBalance.hasOwnProperty(vaultPosition.depositTokenAddress)) {
      return;
    }

    console.log('tokenBalance', tokenBalance);

    setProperties((properties) => ({
      ...properties,
      availableStableBalance: String(
        Number(tokenBalance[vaultPosition.depositTokenAddress].priceDenominationBalance) /
          10 ** tokenBalance[vaultPosition.depositTokenAddress].priceDenominationDecimals,
      ),
      availableTokenBalance: String(
        Number(tokenBalance[vaultPosition.depositTokenAddress].balance) / 10 ** tokenBalance[vaultPosition.depositTokenAddress].decimals,
      ),
    }));
  }, [tokenBalance, vaultPosition]);

  /*const getTokenAmount = (stableAmount: string) => {
    return String(Number(stableAmount) / HOTT_TOKEN_PRICE);
  };*/

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
