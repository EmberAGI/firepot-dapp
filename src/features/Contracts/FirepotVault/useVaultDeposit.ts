import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { mapChain } from '../BeefyVault/reads';
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

  const vaultApprove = useVaultApprove(vaultAddress, rHottTokenAddress, amount);

  const [depositWriteParams, setDepositWriteParams] = useState<{} | undefined>();
  const { config: depositConfig } = usePrepareContractWrite(depositWriteParams);
  const depositContractWrite = useContractWrite(depositConfig);

  useEffect(() => {
    setChainId(mapChain('arbitrum-goerli') ?? 0);
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

    if (vaultApprove.isError) {
      console.error('vaultApprove.isError', vaultApprove.error);
      setError(vaultApprove.error);
      return;
    } else if (!vaultApprove.isSuccess) {
      return;
    }

    setupDeposit();
  }, [status, vaultApprove]);

  useEffect(() => {
    if (status !== 'depositing') return;

    if (depositContractWrite.isError) {
      console.error('vaultApprove.isError', depositContractWrite.error);
      setError(depositContractWrite.error);
      return;
    } else if (!depositContractWrite.isSuccess) {
      return;
    }

    console.log('depositContractWrite.isSuccess', depositContractWrite);
    setStatus('success');
  }, [status, depositContractWrite]);

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
    vaultApprove.write?.();
  };

  const send = () => {
    if (status !== 'awaiting-deposit') return;

    setStatus('depositing');
    depositContractWrite.write?.();
  };

  return {
    status,
    isApprovalRequired,
    error,
    approve,
    send,
  };
}
