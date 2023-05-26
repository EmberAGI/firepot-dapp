import { beefyVaultABI } from '../../../generated.ts';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

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
