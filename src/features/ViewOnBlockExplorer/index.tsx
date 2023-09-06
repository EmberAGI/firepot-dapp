import { useMemo } from 'react';
import { Hex } from 'viem';
import { useNetwork } from 'wagmi';

function useTransactionLinkString(txHash: Hex | undefined): String | undefined {
  const { chain } = useNetwork();

  return useMemo(() => {
    if (!chain?.blockExplorers?.default || !txHash) return undefined;
    return `${chain.blockExplorers.default}/tx/${txHash}`;
  }, [txHash]);
}

export function ViewOnBlockExplorer(data?: { hash: Hex }) {
    // Do we want to spawn a toast? 
    // Should the tx return some JSX?
  // @ts-ignore
  const txLink = useTransactionLinkString(data?.hash);
}
