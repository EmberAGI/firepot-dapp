import { useContractWrite, usePrepareContractWrite, UsePrepareContractWriteConfig } from 'wagmi';

export function useWagmiContractWrite(prepareConfig: UsePrepareContractWriteConfig) {
  const { config } = usePrepareContractWrite(prepareConfig);
  return useContractWrite(config);
}
