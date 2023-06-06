import { useMemo } from 'react';
import { erc20ABI, useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite, UsePrepareContractWriteConfig } from 'wagmi';

export function useWagmiContractWrite(prepareConfig: UsePrepareContractWriteConfig) {
  const { config } = usePrepareContractWrite(prepareConfig);
  return useContractWrite(config);
}

export function useTokenApprove({ spender, amount, tokenAddress }: { spender: `0x${string}`; amount: bigint; tokenAddress: `0x${string}` }) {
  const { config } = usePrepareContractWrite({
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'approve',
    args: [spender, amount],
  });
  return useContractWrite(config);
}

export function useTokenAllowance({
  enabled,
  vaultAddress,
  depositTokenAddress,
}: {
  enabled: boolean;
  vaultAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
}) {
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const { data: tokenAllowanceData } = useContractReads({
    contracts: [
      // vault allowance
      {
        abi: erc20ABI,
        address: vaultAddress,
        functionName: 'allowance',
        args: [userAddress!, vaultAddress],
        chainId: chain?.id,
      },
      // depositToken allowance
      {
        abi: erc20ABI,
        address: depositTokenAddress,
        functionName: 'allowance',
        args: [userAddress!, vaultAddress],
        chainId: chain?.id,
      },
    ],
    enabled: enabled && !!userAddress, // hook does not attemp to fetch data until form has been touched
  });

  const allowances = useMemo(() => {
    if (!tokenAllowanceData)
      return {
        vaultTokenAllowance: 0n,
        depositTokenAllowance: 0n,
      };
    return {
      vaultTokenAllowance: !tokenAllowanceData[0].error ? tokenAllowanceData[0].result : 0n,
      depositTokenAllowance: !tokenAllowanceData[1].error ? tokenAllowanceData[1].result : 0n,
    };
  }, [tokenAllowanceData]);

  return allowances;
}
