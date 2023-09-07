import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useToken } from 'wagmi';
import { useVaultPosition } from '../Contracts/FirepotVault/useVaultPosition';
import { useRHottDetails } from '../Contracts/FirepotVault/useRHottDetails';
import { useTokenBalance } from '../Contracts/FungibleTokens/useTokenBalance';
import { VaultAllowancesParams, useVaultAllowances } from '../Contracts/FirepotVault/useVaultAllowances';
import { useVaultDeposit } from '../Contracts/FirepotVault/useVaultDeposit';

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

interface ButtonState {
  label: string;
  show: boolean;
  isEnabled: boolean;
  showActivityIndicator: boolean;
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
  vaultApproveButton: ButtonState;
  vaultDepositButton: ButtonState;
  /*vaultApproveButtonLabel: string;
  showVaultApproveButton: boolean;
  isVaultApproveComplete: boolean;
  showPrimaryActionButtons: boolean;
  isDepositEnabled: boolean;
  showLockHottButtons: boolean;*/
}

interface ViewModelCommands {
  switchVaultTab: (tab: VaultTab) => void;
  updateMoveStableAmount: (amount: string) => void;
  approveDeposit: () => void;
  deposit: () => void;
  withdraw: () => void;
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
  vaultApproveButton: {
    label: 'Approve Deposit',
    show: false,
    isEnabled: false,
    showActivityIndicator: false,
  },
  vaultDepositButton: {
    label: 'Deposit',
    show: false,
    isEnabled: false,
    showActivityIndicator: false,
  },
  /*vaultApproveButtonLabel: 'Approve Deposit',
  showVaultApproveButton: false,
  isVaultApproveComplete: false,
  showPrimaryActionButtons: false,
  isDepositEnabled: false,
  showLockHottButtons: false,*/
};

export default function useYieldVaultViewModel(address: `0x${string}`, initialState: ViewModelProperties = initialProperties): YieldVaultViewModel {
  const [properties, setProperties] = useState<ViewModelProperties>(initialState);
  //const [depositTokenAddress, setDepositTokenAddress] = useState<`0x${string}` | undefined>();
  //const [moveStableAmount, setMoveStableAmount] = useState<string>('0');
  const [moveTokenAmount, setMoveTokenAmount] = useState<bigint>(0n);
  const vaultPosition = useVaultPosition(address);
  const rHottDetails = useRHottDetails();
  const hottBalance = useTokenBalance(rHottDetails?.hottAddress);
  const [formTouched, setFormTouched] = useState(false);
  const [vaultAllowancesParams, setVaultAllowancesParams] = useState<VaultAllowancesParams | undefined>();
  const vaultAllowances = useVaultAllowances(vaultAllowancesParams);
  const {
    status: vaultDepositStatus,
    isApprovalRequired: isDepositApprovalRequired,
    error: vaultDepositError,
    approve: vaultDepositApprove,
    send: vaultDepositSend,
  } = useVaultDeposit(vaultPosition?.vaultAddress, vaultPosition?.depositTokenAddress, vaultAllowances?.rHottTokenAllowance, moveTokenAmount);

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

  useEffect(() => {
    if (!rHottDetails || !formTouched) return;

    setVaultAllowancesParams({
      vaultAddress: address,
      hottTokenAddress: rHottDetails.hottAddress,
      rHottTokenAddress: rHottDetails.rHottAddress,
    });
  }, [rHottDetails, formTouched]);

  useEffect(() => {
    // For Deposits
    if (properties.vaultTab != 'deposit' || !vaultPosition || !vaultAllowances || moveTokenAmount == 0n || !rHottDetails) {
      return;
    }

    const rHottBalance = rHottDetails.rHottAccountDetails.unallocatedBalance[rHottDetails.rHottAddress].balance;
    const hasEnoughRHott = moveTokenAmount <= rHottBalance;

    console.log('hasEnoughRHott', hasEnoughRHott);

    if (hasEnoughRHott) {
      setProperties((properties) => ({
        ...properties,
        showPrimaryActionButtons: true,
      }));
      /*setVaultDespositParams({
        vaultAddress: vaultPosition.vaultAddress,
        rHottTokenAddress: vaultPosition.depositTokenAddress,
        rHottTokenAllowance: vaultAllowances.rHottTokenAllowance,
        amount: moveTokenAmount,
      });*/
    } else {
      const convertAmount = moveTokenAmount - rHottBalance;
      //convertToRHottAndDesposit(convertAmount);
    }
  }, [vaultPosition, vaultAllowances, moveTokenAmount, rHottDetails]);

  useEffect(() => {
    console.log('vaultDepositStatus', vaultDepositStatus);
    console.log('isDepositApprovalRequired', isDepositApprovalRequired);

    switch (vaultDepositStatus) {
      case 'not-started':
        return;
      case 'awaiting-approval':
        setProperties((properties) => ({
          ...properties,
          vaultApproveButton: {
            ...properties.vaultApproveButton,
            show: true,
            isEnabled: true,
          },
          vaultDepositButton: {
            ...properties.vaultDepositButton,
            show: true,
            isEnabled: false,
            showActivityIndicator: false,
          },
        }));
        return;
      case 'approving':
        setProperties((properties) => ({
          ...properties,
          vaultApproveButton: {
            ...properties.vaultApproveButton,
            isEnabled: false,
            showActivityIndicator: true,
          },
        }));
        return;
      case 'awaiting-deposit':
        setProperties((properties) => ({
          ...properties,
          vaultApproveButton: {
            ...properties.vaultApproveButton,
            show: isDepositApprovalRequired,
            isEnabled: false,
            showActivityIndicator: false,
          },
          vaultDepositButton: {
            ...properties.vaultDepositButton,
            show: true,
            isEnabled: true,
          },
        }));
        return;
      case 'depositing':
        setProperties((properties) => ({
          ...properties,
          vaultDepositButton: {
            ...properties.vaultDepositButton,
            isEnabled: false,
            showActivityIndicator: true,
          },
        }));
        return;
      case 'success':
      case 'error':
        resetMoveTokenState();
    }
  }, [vaultDepositStatus, isDepositApprovalRequired]);

  const switchVaultTab = (tab: VaultTab) => {
    setProperties((properties) => ({
      ...properties,
      vaultTab: tab,
      actionLabel: tab == 'deposit' ? 'Deposit' : 'Withdraw',
    }));
  };

  const resetMoveTokenState = () => {
    setMoveTokenAmount(0n);
    setProperties((properties) => ({
      ...properties,
      moveTokenAmount: '0',
      moveTokenPercentage: 0,
      showTransactionPreview: false,
      vaultApproveButton: {
        ...properties.vaultApproveButton,
        show: false,
        isEnabled: false,
        showActivityIndicator: false,
      },
      vaultDepositButton: {
        ...properties.vaultDepositButton,
        show: false,
        isEnabled: false,
        showActivityIndicator: false,
      },
    }));
  };

  const updateMoveStableAmount = (amount: string) => {
    if (!amount) {
      resetMoveTokenState();
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

    setMoveTokenAmount(BigInt(Number(moveTokenAmount) * 10 ** 18));
    setProperties((properties) => ({
      ...properties,
      moveTokenAmount,
      moveTokenPercentage: percentageDecimal * 100,
      showPrimaryActionButtons: true,
      showTransactionPreview: true,
      transactionPreview,
      showVaultApproveButton: false,
      isVaultApproveComplete: false,
      isDepositEnabled: false,
    }));
    !formTouched && setFormTouched(true);
  };

  const approveDeposit = () => {
    vaultDepositApprove();
  };

  const deposit = () => {
    vaultDepositSend();
  };

  const withdraw = () => {};

  return {
    properties,
    commands: {
      switchVaultTab,
      updateMoveStableAmount,
      approveDeposit,
      deposit,
      withdraw,
    },
  };
}
