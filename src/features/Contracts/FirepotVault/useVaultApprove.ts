import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { mapChain } from '../BeefyVault/reads';

export interface VaultApproveParams {
  address: `0x${string}`;
  rHottTokenAddress: `0x${string}`;
  amount: bigint;
}

export function useVaultApprove(params?: VaultApproveParams) {
  const [chainId, setChainId] = useState<number>(0);
  const [prepareContractWriteParams, setPrepareContractWriteParams] = useState<{} | undefined>();
  const { config } = usePrepareContractWrite(prepareContractWriteParams);

  useEffect(() => {
    setChainId(mapChain('arbitrum-goerli') ?? 0);
  }, []);

  useEffect(() => {
    if (!params) return;

    setPrepareContractWriteParams({
      abi: rHottTokenAbi,
      address: params.rHottTokenAddress,
      functionName: 'approveUsage',
      chainId: chainId,
      args: [params.address, params.amount],
    });
  }, [params]);

  return useContractWrite(config);
}
