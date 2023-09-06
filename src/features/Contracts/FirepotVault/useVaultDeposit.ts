import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { mapChain } from '../BeefyVault/reads';

export interface VaultDepositParams {
  address: `0x${string}`;
  rHottTokenAddress: `0x${string}`;
  amount: bigint;
}

export function useVaultDeposit(params?: VaultDepositParams) {
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
      functionName: 'allocate',
      chainId: chainId,
      args: [params.address, params.amount, '0x00'],
    });
  }, [params]);

  return useContractWrite(config);
}
