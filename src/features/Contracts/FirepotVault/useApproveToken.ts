import { useEffect, useState } from 'react';
import { erc20ABI, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { CHAIN_ID } from '../BeefyVault/reads';

export function useApproveToken(tokenAddress: `0x${string}` | undefined, spenderAddress: `0x${string}` | undefined, amount: bigint | undefined) {
  const [chainId, setChainId] = useState<number>(0);
  const [prepareContractWriteParams, setPrepareContractWriteParams] = useState<{} | undefined>();
  const { config } = usePrepareContractWrite(prepareContractWriteParams);

  useEffect(() => {
    setChainId(CHAIN_ID);
  }, []);

  useEffect(() => {
    if (!tokenAddress || !spenderAddress || !amount) return;

    setPrepareContractWriteParams({
      abi: erc20ABI,
      address: tokenAddress,
      functionName: 'approve',
      chainId: chainId,
      args: [spenderAddress, amount],
    });
  }, [tokenAddress, spenderAddress, amount]);

  return useContractWrite(config);
}
