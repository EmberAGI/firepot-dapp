import { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useAccount, useToken } from 'wagmi';
import { useVaultPosition } from '../Contracts/FirepotVault/useVaultPosition';
import { useRHottDetails } from '../Contracts/FirepotVault/useRHottDetails';
import { useTokenBalance } from '../Contracts/FungibleTokens/useTokenBalance';
import { VaultAllowancesParams, useVaultAllowances } from '../Contracts/FirepotVault/useVaultAllowances';
import { useVaultDeposit } from '../Contracts/FirepotVault/useVaultDeposit';
import { useLockHott } from '../Contracts/FirepotVault/useLockHott';
import { parseUnits, formatUnits } from 'viem';

const precision = 1000000n;
const precisionDecimals = 6;

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
  approveLockButton: ButtonState;
  lockButton: ButtonState;
  approveDepositButton: ButtonState;
  depositButton: ButtonState;
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
  approveLock: () => void;
  lock: () => void;
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
  approveLockButton: {
    label: 'Approve',
    show: false,
    isEnabled: false,
    showActivityIndicator: false,
  },
  lockButton: {
    label: 'Lock tokens',
    show: false,
    isEnabled: false,
    showActivityIndicator: false,
  },
  approveDepositButton: {
    label: 'Approve',
    show: false,
    isEnabled: false,
    showActivityIndicator: false,
  },
  depositButton: {
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
  const [lockTokenAmount, setLockTokenAmount] = useState<bigint>(0n);
  const vaultPosition = useVaultPosition(address);
  const rHottDetails = useRHottDetails();
  const hottBalance = useTokenBalance(rHottDetails?.hottAddress);
  const [formTouched, setFormTouched] = useState(false);
  const [vaultAllowancesParams, setVaultAllowancesParams] = useState<VaultAllowancesParams | undefined>();
  const vaultAllowances = useVaultAllowances(vaultAllowancesParams);
  const {
    status: lockHottStatus,
    isApprovalRequired: isLockApprovalRequired,
    //error: lockHottError,
    approve: lockHottApprove,
    send: lockHottSend,
  } = useLockHott(rHottDetails?.hottAddress, vaultPosition?.depositTokenAddress, vaultAllowances?.hottTokenAllowance, lockTokenAmount);
  const {
    status: vaultDepositStatus,
    isApprovalRequired: isDepositApprovalRequired,
    //error: vaultDepositError,
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

    const apy = vaultPosition.apy;
    setProperties((properties) => ({
      ...properties,
      apy,
    }));
  }, [vaultPosition]);

  useEffect(() => {
    if (!vaultPosition || !vaultPosition.accountDetails) {
      return;
    }

    const vaultStableBalance =
      vaultPosition.accountDetails.priceDenominationBalance / BigInt(10 ** vaultPosition.accountDetails.priceDenominationDecimals);
    const formattedStableBalance = Number(formatUnits(vaultStableBalance, 18)).toFixed(2);
    console.log('vaultStableBalance', vaultStableBalance);
    console.log('formattedStableBalance', formattedStableBalance);
    const stableSymbol = vaultPosition.accountDetails.priceDenominationSymbol;
    const vaultTokenBalance = String(vaultPosition.accountDetails.balance / BigInt(10 ** vaultPosition.depositTokenDecimals));

    setProperties((properties) => ({
      ...properties,
      vaultStableBalance: formattedStableBalance,
      stableSymbol,
      vaultTokenBalance,
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

    console.log('moveTokenAmount', moveTokenAmount);
    console.log('rHottBalance', rHottBalance);

    const hasEnoughRHott = moveTokenAmount <= rHottBalance;

    console.log('hasEnoughRHott', hasEnoughRHott);

    if (!hasEnoughRHott) {
      setLockTokenAmount(moveTokenAmount - rHottBalance);
    } else {
      resetLockTokenState();
    }
  }, [vaultPosition, vaultAllowances, moveTokenAmount, rHottDetails]);

  useEffect(() => {
    console.log('lockHottStatus', lockHottStatus);
    switch (lockHottStatus) {
      case 'not-started':
        return;
      case 'awaiting-approval':
        setProperties((properties) => ({
          ...properties,
          approveLockButton: {
            ...properties.approveLockButton,
            show: true,
            isEnabled: true,
          },
          lockButton: {
            ...properties.lockButton,
            show: true,
            isEnabled: false,
            showActivityIndicator: false,
          },
          approveDepositButton: {
            ...properties.approveDepositButton,
            isEnabled: false,
          },
        }));
        return;
      case 'approving':
        setProperties((properties) => ({
          ...properties,
          approveLockButton: {
            ...properties.approveLockButton,
            isEnabled: false,
            showActivityIndicator: true,
          },
        }));
        return;
      case 'awaiting-lock':
        setProperties((properties) => ({
          ...properties,
          approveLockButton: {
            ...properties.approveLockButton,
            show: isLockApprovalRequired,
            isEnabled: false,
            showActivityIndicator: false,
          },
          lockButton: {
            ...properties.lockButton,
            show: true,
            isEnabled: true,
          },
        }));
        return;
      case 'locking':
        setProperties((properties) => ({
          ...properties,
          lockButton: {
            ...properties.lockButton,
            isEnabled: false,
            showActivityIndicator: true,
          },
        }));
        return;
      case 'success':
      case 'error':
        resetLockTokenState();
    }
  }, [lockHottStatus, isLockApprovalRequired]);

  useEffect(() => {
    if (lockTokenAmount !== 0n) return;

    switch (vaultDepositStatus) {
      case 'not-started':
        return;
      case 'awaiting-approval':
        setProperties((properties) => ({
          ...properties,
          approveDepositButton: {
            ...properties.approveDepositButton,
            show: true,
            isEnabled: true,
          },
          depositButton: {
            ...properties.depositButton,
            show: true,
            isEnabled: false,
            showActivityIndicator: false,
          },
        }));
        return;
      case 'approving':
        setProperties((properties) => ({
          ...properties,
          approveDepositButton: {
            ...properties.approveDepositButton,
            isEnabled: false,
            showActivityIndicator: true,
          },
        }));
        return;
      case 'awaiting-deposit':
        setProperties((properties) => ({
          ...properties,
          approveDepositButton: {
            ...properties.approveDepositButton,
            show: isDepositApprovalRequired,
            isEnabled: false,
            showActivityIndicator: false,
          },
          depositButton: {
            ...properties.depositButton,
            show: true,
            isEnabled: true,
          },
        }));
        return;
      case 'depositing':
        setProperties((properties) => ({
          ...properties,
          depositButton: {
            ...properties.depositButton,
            isEnabled: false,
            showActivityIndicator: true,
          },
        }));
        return;
      case 'success':
      case 'error':
        resetMoveTokenState();
    }
  }, [lockTokenAmount, vaultDepositStatus, isDepositApprovalRequired]);

  const switchVaultTab = (tab: VaultTab) => {
    setProperties((properties) => ({
      ...properties,
      vaultTab: tab,
      actionLabel: tab == 'deposit' ? 'Deposit' : 'Withdraw',
    }));
  };

  const resetLockTokenState = () => {
    setLockTokenAmount(0n);
    setProperties((properties) => ({
      ...properties,
      approveLockButton: {
        ...properties.approveLockButton,
        show: false,
        isEnabled: false,
        showActivityIndicator: false,
      },
      lockButton: {
        ...properties.lockButton,
        show: false,
        isEnabled: false,
        showActivityIndicator: false,
      },
    }));
  };

  const resetMoveTokenState = () => {
    setMoveTokenAmount(0n);
    setProperties((properties) => ({
      ...properties,
      moveTokenAmount: '0',
      moveTokenPercentage: 0,
      showTransactionPreview: false,
      approveDepositButton: {
        ...properties.approveDepositButton,
        show: false,
        isEnabled: false,
        showActivityIndicator: false,
      },
      depositButton: {
        ...properties.depositButton,
        show: false,
        isEnabled: false,
        showActivityIndicator: false,
      },
    }));
  };

  const updateMoveStableAmount = (amount: string) => {
    if (!amount) {
      console.log('RESETTING STATES');
      resetLockTokenState();
      resetMoveTokenState();
      return;
    }

    const availableStableBalance = parseUnits(properties.availableStableBalance as `${number}`, precisionDecimals);

    if (availableStableBalance == 0n) return;

    const percentageDecimal = (parseUnits(amount as `${number}`, precisionDecimals) * precision) / availableStableBalance;
    const moveTokenAmount = (parseUnits(properties.availableTokenBalance as `${number}`, 18) * percentageDecimal) / precision;
    const formattedMoveTokenAmount = formatUnits(moveTokenAmount, 18);

    const transactionPreview = {
      tokenSymbol: properties.tokenSymbol,
      stableSymbol: properties.stableSymbol,
      subtotalTokenAmount: formattedMoveTokenAmount,
      subtotalStableAmount: amount,
      penaltyTokenAmount: '0',
      penaltyStableAmount: '0',
      feesTokenAmount: '0',
      feesStableAmount: '0',
      totalTokenAmount: formattedMoveTokenAmount,
      totalStableAmount: amount,
    };

    setMoveTokenAmount(moveTokenAmount);
    setProperties((properties) => ({
      ...properties,
      moveTokenAmount: formattedMoveTokenAmount,
      moveTokenPercentage: Number((percentageDecimal * 100n) / precision),
      //showPrimaryActionButtons: true,
      showTransactionPreview: true,
      transactionPreview,
      /*showVaultApproveButton: false,
      isVaultApproveComplete: false,
      isDepositEnabled: false,*/
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
      approveLock: lockHottApprove,
      lock: lockHottSend,
      deposit,
      withdraw,
    },
  };
}
