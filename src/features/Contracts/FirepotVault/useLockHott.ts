import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { CHAIN } from '../BeefyVault/reads';
import { useApproveToken } from './useApproveToken';

type LockHottStatus = 'not-started' | 'awaiting-approval' | 'approving' | 'awaiting-lock' | 'locking' | 'success' | 'error';

interface LockHott {
  status: LockHottStatus;
  isApprovalRequired: boolean;
  error: Error | null;
  approve: () => void;
  send: () => void;
}

export function useLockHott(
  hottTokenAddress: `0x${string}` | undefined,
  rHottTokenAddress: `0x${string}` | undefined,
  hottTokenAllowance: bigint | undefined,
  amount: bigint | undefined,
): LockHott {
  const [status, setStatus] = useState<LockHottStatus>('not-started');
  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [chainId, setChainId] = useState<number>(0);

  const {
    data: approveData,
    status: approveStatus,
    error: approveError,
    write: approveWrite,
  } = useApproveToken(hottTokenAddress, rHottTokenAddress, amount);
  const { data: approveTxData, status: approveTxStatus, error: approveTxError } = useWaitForTransaction(approveData);

  const [lockWriteParams, setLockWriteParams] = useState<{} | undefined>();
  const { config: lockConfig } = usePrepareContractWrite(lockWriteParams);
  const { data: lockData, status: lockStatus, error: lockError, write: lockWrite } = useContractWrite(lockConfig);
  const { data: lockTxData, status: lockTxStatus, error: lockTxError } = useWaitForTransaction(lockData);

  useEffect(() => {
    setChainId(CHAIN);
  }, []);

  useEffect(() => {
    resetState();
  }, [amount]);

  useEffect(() => {
    if (hottTokenAllowance == null || amount == null || amount === 0n) {
      return;
    }

    if (hottTokenAllowance < amount) {
      setIsApprovalRequired(true);
      setStatus('awaiting-approval');
    } else {
      setupLock();
    }
  }, [hottTokenAllowance, amount]);

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
    setupLock();
  }, [status, approveStatus, approveTxStatus, approveError, approveTxError]);

  useEffect(() => {
    if (status !== 'locking') return;

    if (lockStatus === 'error' || lockTxStatus === 'error') {
      const error = lockError ?? lockTxError;
      console.error('lock error: ', error);
      setError(error);
      return;
    } else if (lockStatus !== 'success' || lockTxStatus !== 'success') {
      return;
    }

    console.log('lock successful! ', lockTxData);
    setStatus('success');
  }, [status, lockStatus, lockTxStatus, lockError, lockTxError]);

  const setupLock = () => {
    setLockWriteParams({
      abi: rHottTokenAbi,
      address: rHottTokenAddress,
      functionName: 'convert',
      chainId: chainId,
      args: [amount],
    });
    setStatus('awaiting-lock');
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
    if (status !== 'awaiting-lock') return;

    setStatus('locking');
    lockWrite?.();
  };

  return {
    status,
    isApprovalRequired,
    error,
    approve,
    send,
  };
}
