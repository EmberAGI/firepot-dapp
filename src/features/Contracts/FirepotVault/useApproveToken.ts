import { useEffect, useState } from 'react';
import { useTokenApprove } from '../hooks';
import { erc20ABI, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { mapChain } from '../BeefyVault/reads';

export interface ApproveTokenParams {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amount: bigint;
}

export function useApproveToken(params?: ApproveTokenParams) {
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
      address: params.tokenAddress,
      functionName: 'approve',
      chainId: chainId,
      args: [params.spenderAddress, params.amount],
    });
  }, [params]);

  return useContractWrite(config);
}
