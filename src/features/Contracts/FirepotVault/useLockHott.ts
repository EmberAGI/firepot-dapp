import { useEffect, useState } from 'react';
import { useTokenApprove } from '../hooks';
import { erc20ABI, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { mapChain } from '../BeefyVault/reads';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';

export interface LockHottParams {
  address: `0x${string}`;
  rHottTokenAddress: `0x${string}`;
  amount: bigint;
}

export function useLockHott(params?: LockHottParams) {
  const [chainId, setChainId] = useState<number>(0);
  const [prepareContractWriteParams, setPrepareContractWriteParams] = useState<{} | undefined>();
  const { config } = usePrepareContractWrite(prepareContractWriteParams);

  useEffect(() => {
    setChainId(mapChain('arbitrum-goerli') ?? 0);
  }, []);

  useEffect(() => {
    if (!params) return;

    setPrepareContractWriteParams({
      abi: erc20ABI,
      address: params.rHottTokenAddress,
      functionName: 'approve',
      chainId: chainId,
      args: [params.address, params.amount],
    });
  }, [params]);

  return useContractWrite(config);
}
