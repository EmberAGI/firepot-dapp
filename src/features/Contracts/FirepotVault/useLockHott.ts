import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { mapChain } from '../BeefyVault/reads';
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

  const approveToken = useApproveToken(hottTokenAddress, rHottTokenAddress, amount);

  const [lockWriteParams, setLockWriteParams] = useState<{} | undefined>();
  const { config: lockConfig } = usePrepareContractWrite(lockWriteParams);
  const lockContractWrite = useContractWrite(lockConfig);

  useEffect(() => {
    setChainId(mapChain('arbitrum-goerli') ?? 0);
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

    if (approveToken.isError) {
      console.error('vaultApprove.isError', approveToken.error);
      setError(approveToken.error);
      return;
    } else if (!approveToken.isSuccess) {
      return;
    }

    setupLock();
  }, [status, approveToken]);

  useEffect(() => {
    if (status !== 'locking') return;

    if (lockContractWrite.isError) {
      console.error('vaultApprove.isError', lockContractWrite.error);
      setError(lockContractWrite.error);
      return;
    } else if (!lockContractWrite.isSuccess) {
      return;
    }

    console.log('lockContractWrite.isSuccess', lockContractWrite);
    setStatus('success');
  }, [status, lockContractWrite]);

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
    approveToken.write?.();
  };

  const send = () => {
    if (status !== 'awaiting-lock') return;

    setStatus('locking');
    lockContractWrite.write?.();
  };

  return {
    status,
    isApprovalRequired,
    error,
    approve,
    send,
  };
}
