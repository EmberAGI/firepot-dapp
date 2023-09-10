import { useEffect, useMemo, useState } from 'react';
import { erc20ABI, readContracts, useAccount } from 'wagmi';
import { CHAIN_ID, MulticallContractFunctionConfig } from '../BeefyVault/reads';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';

export interface VaultAllowancesParams {
  vaultAddress: `0x${string}`;
  hottTokenAddress: `0x${string}`;
  rHottTokenAddress: `0x${string}`;
}

interface VaultAllowances {
  hottTokenAllowance: bigint;
  rHottTokenAllowance: bigint;
}

export function useVaultAllowances(params?: VaultAllowancesParams) {
  const { address: accountAddress } = useAccount();
  const [chainId, setChainId] = useState<number>(0);
  const [tokenAllowanceResponse, setTokenAllowanceResponse] = useState<any[] | undefined>();
  /*const { data: tokenAllowanceData } = useContractReads({
    contracts: [
      // HOTT allowance for rHOTT spender
      {
        abi: erc20ABI,
        address: hottTokenAddress,
        functionName: 'allowance',
        args: [accountAddress!, rHottTokenAddress],
        chainId: chainId,
      },
      // rHOTT allowance for vault spender
      {
        abi: rHottTokenAbi,
        address: rHottTokenAddress,
        functionName: 'getUsageApproval',
        args: [accountAddress!, vaultAddress],
        chainId: chainId,
      },
    ],
    enabled: enabled && !!accountAddress, // hook does not attempt to fetch data until form has been touched
  });*/

  useEffect(() => {
    setChainId(CHAIN_ID);
  }, []);

  useEffect(() => {
    async function getAllowances() {
      if (!params || !accountAddress || !chainId) {
        return;
      }

      console.log('getAllowances');

      const contractReadConfig: MulticallContractFunctionConfig[] = [
        // HOTT allowance for rHOTT spender
        {
          abi: erc20ABI,
          address: params.hottTokenAddress,
          functionName: 'allowance',
          args: [accountAddress!, params.rHottTokenAddress],
          chainId: chainId,
        },
        // rHOTT allowance for vault spender
        {
          abi: rHottTokenAbi,
          address: params.rHottTokenAddress,
          functionName: 'getUsageApproval',
          args: [accountAddress!, params.vaultAddress],
          chainId: chainId,
        },
      ];

      const readResponse = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });
      setTokenAllowanceResponse(readResponse);
    }
    getAllowances();
  }, [params, accountAddress, chainId]);

  const allowances: VaultAllowances | undefined = useMemo(() => {
    if (!tokenAllowanceResponse || tokenAllowanceResponse[0].error || tokenAllowanceResponse[1].error) return;

    return {
      hottTokenAllowance: tokenAllowanceResponse[0].result,
      rHottTokenAllowance: tokenAllowanceResponse[1].result,
    };
  }, [tokenAllowanceResponse]);

  return allowances;
}
