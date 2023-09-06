import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useToken } from 'wagmi';
import { useVaultPosition } from '../Contracts/FirepotVault/useVaultPosition';
import { useRHottDetails } from '../Contracts/FirepotVault/useRHottDetails';
import { useTokenBalance } from '../Contracts/FungibleTokens/useTokenBalance';
import { VaultAllowancesParams, useVaultAllowances } from '../Contracts/FirepotVault/useVaultAllowances';
import { VaultDepositParams, useVaultDeposit } from '../Contracts/FirepotVault/useVaultDeposit';
import { VaultApproveParams, useVaultApprove } from '../Contracts/FirepotVault/useVaultApprove';

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
  vaultApproveButtonLabel: string;
  showVaultApproveButton: boolean;
  isVaultApproveComplete: boolean;
  showPrimaryActionButtons: boolean;
  isDepositEnabled: boolean;
  showLockHottButtons: boolean;
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
  vaultApproveButtonLabel: 'Approve Deposit',
  showVaultApproveButton: false,
  isVaultApproveComplete: false,
  showPrimaryActionButtons: false,
  isDepositEnabled: false,
  showLockHottButtons: false,
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
  const [isDepositReady, setIsDepositReady] = useState(false);
  const [vaultDepositParams, setVaultDespositParams] = useState<VaultDepositParams | undefined>();
  const vaultDeposit = useVaultDeposit(vaultDepositParams);
  const [isVaultApproveRequired, setIsVaultApproveRequired] = useState(false);
  const [vaultApproveParams, setVaultApproveParams] = useState<VaultApproveParams | undefined>();
  const vaultApprove = useVaultApprove(vaultApproveParams);

  useEffect(() => {
    setTimeout(() => {
      setProperties((properties) => ({
        ...properties,
        showLoading: false,
      }));
    }, 1000);
  }, []);

  /*useEffect(() => {
    if (!vaultPosition) {
      return;
    }

    setDepositTokenAddress(vaultPosition.depositTokenAddress);
  }, [vaultPosition]);*/

  useEffect(() => {
    if (!isDepositReady || !vaultPosition || moveTokenAmount == 0n) return;

    setVaultDespositParams({
      address: vaultPosition.vaultAddress,
      rHottTokenAddress: vaultPosition.depositTokenAddress,
      amount: moveTokenAmount,
    });
    setProperties((properties) => ({
      ...properties,
      isDepositEnabled: true,
    }));
  }, [isDepositReady, vaultPosition, moveTokenAmount]);

  useEffect(() => {
    if (!isVaultApproveRequired || !vaultPosition || moveTokenAmount == 0n || !vaultAllowances) return;

    setVaultApproveParams({
      address: vaultPosition.vaultAddress,
      rHottTokenAddress: vaultPosition.depositTokenAddress,
      amount: moveTokenAmount,
    });
    setProperties((properties) => ({
      ...properties,
      showVaultApproveButton: true,
      isDepositEnabled: false,
    }));
  }, [isVaultApproveRequired, vaultPosition, moveTokenAmount, vaultAllowances]);

  useEffect(() => {
    if (!isVaultApproveRequired || !vaultApprove || vaultApprove.isLoading || vaultApprove.isIdle) return;

    if (vaultApprove.isError) {
      console.log('vaultApprove.isError', vaultApprove.error);
      return;
    } else if (!vaultApprove.isSuccess) {
      return;
    }

    console.log('vaultApprove.isSuccess', vaultApprove);

    setIsVaultApproveRequired(false);
    setProperties((properties) => ({
      ...properties,
      isVaultApproveComplete: true,
      isDepositEnabled: true,
    }));
    setIsDepositReady(true);
  }, [isVaultApproveRequired, vaultApprove]);

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

  useEffect(() => {
    if (!rHottDetails || !formTouched) return;

    setVaultAllowancesParams({
      vaultAddress: address,
      hottTokenAddress: rHottDetails.hottAddress,
      rHottTokenAddress: rHottDetails.rHottAddress,
    });
  }, [rHottDetails, formTouched]);

  useEffect(() => {
    console.log('For Deposits');
    console.log('properties.vaultTab', properties.vaultTab);
    console.log('vaultAllowances', vaultAllowances);
    console.log('moveTokenAmount', moveTokenAmount);
    console.log('rHottDetails', rHottDetails);

    // For Deposits
    if (properties.vaultTab != 'deposit' || !vaultAllowances || moveTokenAmount == 0n || !rHottDetails) {
      return;
    }

    console.log('For Deposits - CONTINUE');

    const rHottBalance = rHottDetails.rHottAccountDetails.unallocatedBalance[rHottDetails.rHottAddress].balance;
    const hasEnoughRHott = moveTokenAmount <= rHottBalance;

    console.log('hasEnoughRHott', hasEnoughRHott);

    if (hasEnoughRHott) {
      depositRHott(vaultAllowances.rHottTokenAllowance);
    } else {
      const convertAmount = moveTokenAmount - rHottBalance;
      //convertToRHottAndDesposit(convertAmount);
    }
  }, [vaultAllowances, moveTokenAmount, rHottDetails]);

  const depositRHott = (rHottTokenAllowance: bigint) => {
    const hasRHottAllowance = moveTokenAmount <= rHottTokenAllowance;
    if (hasRHottAllowance) {
      setIsDepositReady(true);
    } else {
      setIsVaultApproveRequired(true);
      //approveRHott();
    }
  };

  const switchVaultTab = (tab: VaultTab) => {
    setProperties((properties) => ({
      ...properties,
      vaultTab: tab,
      actionLabel: tab == 'deposit' ? 'Deposit' : 'Withdraw',
    }));
  };

  const updateMoveStableAmount = (amount: string) => {
    if (!amount) {
      //setMoveStableAmount('0');
      setProperties((properties) => ({
        ...properties,
        moveTokenAmount: '0',
        moveTokenPercentage: 0,
        showPrimaryActionButtons: false,
        showTransactionPreview: false,
        isDepositEnabled: false,
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

    setIsDepositReady(false);
    setVaultDespositParams(undefined);
    setIsVaultApproveRequired(false);
    setVaultApproveParams(undefined);
    //setMoveStableAmount(amount);
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
    vaultApprove.write?.();
  };

  const deposit = () => {
    vaultDeposit.write?.();
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
