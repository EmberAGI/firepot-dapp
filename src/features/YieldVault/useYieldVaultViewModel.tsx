import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useToken } from 'wagmi';
import { useVaultPosition } from '../Contracts/FirepotVault/useVaultPosition';
import { useRHottDetails } from '../Contracts/FirepotVault/useRHottDetails';
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
  vaultStableBalance: '0.00',
  availableStableBalance: '0.00',
  stableSymbol: 'USD',
  vaultTokenBalance: '0',
  availableTokenBalance: '0',
  tokenSymbol: 'HOTT',
  showLoading: true,
  showTransactionPreview: false,
  vaultTab: 'deposit',
  actionLabel: 'Deposit',
  moveTokenAmount: '0',
  moveTokenPercentage: 0,
  apy: '0.00',
  vaultReturn: {
    tokenReturn: '0.00',
    returnPercentage: '0.00',
  },
  showActionButton: false,
};

export default function useYieldVaultViewModel(address: `0x${string}`, initialState: ViewModelProperties = initialProperties): YieldVaultViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  const [depositTokenAddress, setDepositTokenAddress] = useState<`0x${string}` | undefined>();
  const [moveStableAmount, setMoveStableAmount] = useState<string>('0');
  const vaultPosition = useVaultPosition(address);
  const rHottDetails = useRHottDetails();
  const hottBalance = useTokenBalance(rHottDetails?.hottAddress);
  const approvals = useEffect(() => {
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
    const unallocatedBalance = rHottDetails?.rHottAccountDetails.unallocatedBalance;
    if (
      !rHottDetails ||
      !hottBalance ||
      !vaultPosition ||
      !unallocatedBalance?.hasOwnProperty(vaultPosition.depositTokenAddress) ||
      !hottBalance.hasOwnProperty(rHottDetails.hottAddress)
    ) {
      return;
    }

    const totalHottRHottBalance = unallocatedBalance[vaultPosition.depositTokenAddress].balance + hottBalance[rHottDetails.hottAddress].balance;
    const totalHottRHottDenomBalance =
      unallocatedBalance[vaultPosition.depositTokenAddress].priceDenominationBalance + hottBalance[rHottDetails.hottAddress].priceDenominationBalance;

    setProperties((properties) => ({
      ...properties,
      availableStableBalance: String(
        Number(totalHottRHottDenomBalance) / 10 ** unallocatedBalance[vaultPosition.depositTokenAddress].priceDenominationDecimals,
      ),
      availableTokenBalance: String(Number(totalHottRHottBalance) / 10 ** unallocatedBalance[vaultPosition.depositTokenAddress].decimals),
    }));
  }, [rHottDetails, hottBalance, vaultPosition]);

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
