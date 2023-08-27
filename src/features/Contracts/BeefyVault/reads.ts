import { erc20ABI, mainnet, readContracts, useAccount } from 'wagmi';
import { OpportunityData } from '../../futureRelease/SmartDiscovery/types';
import { useEffect, useState } from 'react';
import { ContractFunctionConfig } from 'viem';
import { arbitrum, aurora, avalanche, bsc, canto, celo, cronos, fantom, metis, moonbeam, moonriver, optimism, polygon, zkSync } from 'wagmi/chains';

function mapChain(chain: string): number | null {
  switch (chain) {
    // case 'emerald': return 42262;
    // case 'fuse': return 122;
    // case 'kava': return 2222;
    case 'arbitrum':
      return arbitrum.id;
    case 'aurora':
      return aurora.id;
    case 'avax':
      return avalanche.id;
    case 'bsc':
      return bsc.id;
    case 'canto':
      return canto.id;
    case 'celo':
      return celo.id;
    case 'cronos':
      return cronos.id;
    case 'ethereum':
      return mainnet.id;
    case 'fantom':
      return fantom.id;
    case 'metis':
      return metis.id;
    case 'moonbeam':
      return moonbeam.id;
    case 'moonriver':
      return moonriver.id;
    case 'optimism':
      return optimism.id;
    case 'polygon':
      return polygon.id;
    case 'zksync':
      return zkSync.id;
  }
  return null;
}

type MultichainContractFunctionsConfig = ContractFunctionConfig & { chainId: number };
function packContractCalls({
  userAddress,
  vaultAddress,
  depositTokenAddress,
  chainId,
}: {
  userAddress: `0x${string}`;
  vaultAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
  chainId: number | null;
}): MultichainContractFunctionsConfig[] {
  if (!chainId) chainId = 0; // forces a fail, but does not change array size from the opportunityData size
  return [
    // vault balance
    {
      abi: erc20ABI,
      address: vaultAddress,
      functionName: 'balanceOf',
      args: [userAddress],
      chainId,
    },
    // depositToken balance
    {
      abi: erc20ABI,
      address: depositTokenAddress,
      functionName: 'balanceOf',
      args: [userAddress],
      chainId,
    },
  ];
}

export type TokenBalances = TokenBalanceElem[] | null;
export type TokenBalanceElem = {
  vaultTokenBalance: bigint;
  depositTokenBalance: bigint;
};
export const defaultTokenBalance: TokenBalanceElem = {
  vaultTokenBalance: 0n,
  depositTokenBalance: 0n,
};
export function useChainData(opportunityData: OpportunityData[]): TokenBalances {
  const [chainData, setChainData] = useState<TokenBalances>(null);
  const { address } = useAccount();
  useEffect(() => {
    async function getDatData() {
      if (opportunityData.length == 0) return;
      if (!address) return;
      const contractReadConfig = opportunityData.flatMap((opportunity) =>
        packContractCalls({
          userAddress: address,
          vaultAddress: opportunity.vaultAddress,
          depositTokenAddress: opportunity.depositTokenAddress,
          chainId: mapChain(opportunity.chain),
        }),
      );

      const data = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      setChainData(
        data.reduce(
          (reducer, _, index) => {
            if (index % 2 != 0) return reducer;
            reducer[index / 2] = {
              vaultTokenBalance: !data[index].error && data[index].result,
              depositTokenBalance: !data[index + 1].error && data[index + 1].result,
            };
            return reducer;
          },
          new Array(data.length / 2).fill({
            vaultTokenBalance: 0n,
            depositTokenBalance: 0n,
          }),
        ),
      );
    }
    getDatData();
  }, [opportunityData, address]);
  return chainData;
}
