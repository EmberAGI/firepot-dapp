import { simpleVaultAbi } from '../abis/SimpleVault.ts';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

type BeefyVaultConfig = {
  contractAddress: `0x${string}`;
  chainId: number;
};

export function useBeefyVaultDeposit(amount: bigint, { contractAddress, chainId }: BeefyVaultConfig) {
  const { config } = usePrepareContractWrite({
    abi: simpleVaultAbi,
    address: contractAddress,
    functionName: 'deposit',
    chainId,
    args: [amount],
  });
  return useContractWrite(config);
}

export function useBeefyVaultWithdraw(amount: bigint, { contractAddress, chainId }: BeefyVaultConfig) {
  const { config } = usePrepareContractWrite({
    abi: simpleVaultAbi,
    address: contractAddress,
    functionName: 'withdraw',
    chainId,
    args: [amount],
  });
  return useContractWrite(config);
}
