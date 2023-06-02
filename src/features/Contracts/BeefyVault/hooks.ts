import { useMemo, useState } from 'react';
import { beefyVaultABI } from '../../../generated.ts';
import { erc20ABI, useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';

type BeefyVaultConfig = {
  contractAddress: `0x${string}`;
  chainId: number;
};
export function useBeefyVaultDeposit(amount: bigint, { contractAddress, chainId }: BeefyVaultConfig) {
  const { config } = usePrepareContractWrite({
    abi: beefyVaultABI,
    address: contractAddress,
    functionName: 'deposit',
    chainId,
    args: [amount],
  });
  return useContractWrite(config);
}

export function useBeefyVaultWithdraw(amount: bigint, { contractAddress, chainId }: BeefyVaultConfig) {
  const { config } = usePrepareContractWrite({
    abi: beefyVaultABI,
    address: contractAddress,
    functionName: 'withdraw',
    chainId,
    args: [amount],
  });
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

////////////////////////////////////////
/// HELPER FUNCTIONS FOR usePrettyBigInt
////////////////////////////////////////

// Decides if formAmount is a number and if form should update or not
function safeAmountChange(formAmount: string, prevVal: string, nDecimals: number): string {
  if (isNaN(Number(formAmount)) || (formAmount.split('.').length > 1 && formAmount.split('.')[1].length > nDecimals)) {
    return prevVal;
  }
  return formAmount;
}

// provides number of leading zeros needed to display bigint decimals
function leadingZeros(bi: bigint, decimals: number): number {
  let out = 0;
  for (let i = 0n; i < decimals - 1; i++) {
    bi /= 10n;
    if (bi == 0n) {
      ++out;
    }
  }
  return out;
}

// breaks bigint into whole numbers and decimal parts
function formatBigInt(bi: bigint, decimals: number): string {
  const divisor = BigInt('1' + '0'.repeat(decimals));
  const wholePart = bi / divisor;
  const decimalPart = bi % divisor;
  return wholePart.toString().concat('.', '0'.repeat(leadingZeros(decimalPart, decimals)), decimalPart.toString());
}

// Hook to manage form state converting form strings into uint256 bigint values for token inputs
export function usePrettyBigInt(decimalPlaces: number) {
  const [formVal, unsafeSetFormVal] = useState('');
  const amount: bigint = useMemo(() => {
    let spl = formVal.split('.');
    let spl1 = '';
    if (spl.length > 1) {
      spl1 = `${spl[1]}${'0'.repeat(decimalPlaces - spl[1].length)}`;
    } else {
      spl1 = '0'.repeat(decimalPlaces);
    }
    return BigInt(spl[0].concat(spl1));
  }, [formVal]);

  const setFormVal = (val: string | bigint) => {
    if (typeof val == 'string') {
      unsafeSetFormVal(safeAmountChange(val, formVal, decimalPlaces));
    }
    if (typeof val == 'bigint') {
      unsafeSetFormVal(formatBigInt(val, decimalPlaces));
    }
  };

  return { amount, formVal, setFormVal };
}
