import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { CHAIN_ID } from '../BeefyVault/reads';

export function useVaultApprove(vaultAddress: `0x${string}` | undefined, rHottTokenAddress: `0x${string}` | undefined, amount: bigint | undefined) {
  const [chainId, setChainId] = useState<number>(0);
  const [prepareContractWriteParams, setPrepareContractWriteParams] = useState<{} | undefined>();
  const { config } = usePrepareContractWrite(prepareContractWriteParams);

  useEffect(() => {
    setChainId(CHAIN_ID);
  }, []);

  useEffect(() => {
    if (!vaultAddress || !rHottTokenAddress || !amount) return;

    setPrepareContractWriteParams({
      abi: rHottTokenAbi,
      address: rHottTokenAddress,
      functionName: 'approveUsage',
      chainId: chainId,
      args: [vaultAddress, amount],
    });
  }, [vaultAddress, rHottTokenAddress, amount, chainId]);

  return useContractWrite(config);
}
