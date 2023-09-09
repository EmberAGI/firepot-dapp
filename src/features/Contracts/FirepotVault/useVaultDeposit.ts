import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { CHAIN } from '../BeefyVault/reads';
import { useVaultApprove } from './useVaultApprove';

type VaultDepositStatus = 'not-started' | 'awaiting-approval' | 'approving' | 'awaiting-deposit' | 'depositing' | 'success' | 'error';

interface VaultDeposit {
  status: VaultDepositStatus;
  isApprovalRequired: boolean;
  error: Error | null;
  approve: () => void;
  send: () => void;
}

export function useVaultDeposit(
  vaultAddress: `0x${string}` | undefined,
  rHottTokenAddress: `0x${string}` | undefined,
  rHottTokenAllowance: bigint | undefined,
  amount: bigint | undefined,
): VaultDeposit {
  const [status, setStatus] = useState<VaultDepositStatus>('not-started');
  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [chainId, setChainId] = useState<number>(0);

  const {
    data: approveData,
    status: approveStatus,
    error: approveError,
    write: approveWrite,
  } = useVaultApprove(vaultAddress, rHottTokenAddress, amount);
  const { data: approveTxData, status: approveTxStatus, error: approveTxError } = useWaitForTransaction(approveData);

  const [depositWriteParams, setDepositWriteParams] = useState<{} | undefined>();
  const { config: depositConfig } = usePrepareContractWrite(depositWriteParams);
  const { data: depositData, status: depositStatus, error: depositError, write: depositWrite } = useContractWrite(depositConfig);
  const { data: depositTxData, status: depositTxStatus, error: depositTxError } = useWaitForTransaction(depositData);

  useEffect(() => {
    setChainId(CHAIN);
  }, []);

  useEffect(() => {
    resetState();
  }, [amount]);

  useEffect(() => {
    if (rHottTokenAllowance == null || amount == null || amount === 0n) {
      return;
    }

    if (rHottTokenAllowance < amount) {
      setIsApprovalRequired(true);
      setStatus('awaiting-approval');
    } else {
      setupDeposit();
    }
  }, [rHottTokenAllowance, amount]);

  useEffect(() => {
    if (status !== 'approving') return;

    if (approveStatus === 'error' || approveTxStatus === 'error') {
      const error = approveError ?? approveTxError;
      console.error('approve error: ', error);
      setError(error);
      return;
    } else if (approveStatus !== 'success' || approveTxStatus !== 'success') {
      return;
    }

    console.log('approve successful! ', approveTxData);
    setupDeposit();
  }, [status, approveStatus, approveTxStatus, approveError, approveTxError]);

  useEffect(() => {
    if (status !== 'depositing') return;

    if (depositStatus === 'error' || depositTxStatus === 'error') {
      const error = depositError ?? depositTxError;
      console.error('deposit error: ', error);
      setError(error);
      return;
    } else if (depositStatus !== 'success' || depositTxStatus !== 'success') {
      return;
    }

    console.log('deposit successful! ', depositTxData);
    setStatus('success');
  }, [status, depositStatus, depositTxStatus, depositError, depositTxError]);

  const setupDeposit = () => {
    setDepositWriteParams({
      abi: rHottTokenAbi,
      address: rHottTokenAddress,
      functionName: 'allocate',
      chainId: chainId,
      args: [vaultAddress, amount, '0x00'],
    });
    setStatus('awaiting-deposit');
  };

  const resetState = () => {
    setIsApprovalRequired(false);
    setStatus('not-started');
    setError(null);
  };

  const approve = () => {
    if (status !== 'awaiting-approval') return;

    setStatus('approving');
    approveWrite?.();
  };

  const send = () => {
    if (status !== 'awaiting-deposit') return;

    setStatus('depositing');
    depositWrite?.();
  };

  return {
    status,
    isApprovalRequired,
    error,
    approve,
    send,
  };
}
