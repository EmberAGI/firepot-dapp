import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { CHAIN_ID } from '../BeefyVault/reads';
import { useVaultApprove } from './useVaultApprove';

type VaultWithdrawStatus = 'not-started' | 'awaiting-approval' | 'approving' | 'awaiting-withdraw' | 'withdrawing' | 'success' | 'error';

interface VaultWithdraw {
  status: VaultWithdrawStatus;
  isApprovalRequired: boolean;
  error: Error | null;
  approve: () => void;
  send: () => void;
}

export function useVaultWithdraw(
  vaultAddress: `0x${string}` | undefined,
  rHottTokenAddress: `0x${string}` | undefined,
  rHottTokenAllowance: bigint | undefined,
  amount: bigint | undefined,
): VaultWithdraw {
  const [status, setStatus] = useState<VaultWithdrawStatus>('not-started');
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

  const [withdrawWriteParams, setWithdrawWriteParams] = useState<{} | undefined>();
  const { config: withdrawConfig } = usePrepareContractWrite(withdrawWriteParams);
  const { data: withdrawData, status: withdrawStatus, error: withdrawError, write: withdrawWrite } = useContractWrite(withdrawConfig);
  const { data: withdrawTxData, status: withdrawTxStatus, error: withdrawTxError } = useWaitForTransaction(withdrawData);

  useEffect(() => {
    setChainId(CHAIN_ID);
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
      setupWithdraw();
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
    setupWithdraw();
  }, [status, approveStatus, approveTxStatus, approveError, approveTxError]);

  useEffect(() => {
    if (status !== 'withdrawing') return;

    if (withdrawStatus === 'error' || withdrawTxStatus === 'error') {
      const error = withdrawError ?? withdrawTxError;
      console.error('withdraw error: ', error);
      setError(error);
      return;
    } else if (withdrawStatus !== 'success' || withdrawTxStatus !== 'success') {
      return;
    }

    console.log('withdraw successful! ', withdrawTxData);
    setStatus('success');
  }, [status, withdrawStatus, withdrawTxStatus, withdrawError, withdrawTxError]);

  const setupWithdraw = () => {
    setWithdrawWriteParams({
      abi: rHottTokenAbi,
      address: rHottTokenAddress,
      functionName: 'deallocate',
      chainId: chainId,
      args: [vaultAddress, amount, '0x00'],
    });
    setStatus('awaiting-withdraw');
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
    if (status !== 'awaiting-withdraw') return;

    setStatus('withdrawing');
    withdrawWrite?.();
  };

  return {
    status,
    isApprovalRequired,
    error,
    approve,
    send,
  };
}
