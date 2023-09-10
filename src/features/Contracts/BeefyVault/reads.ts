import { erc20ABI, mainnet, readContracts, useAccount } from 'wagmi';
import { OpportunityData } from '../../futureRelease/SmartDiscovery/types';
import { useEffect, useState } from 'react';
import { ContractFunctionConfig } from 'viem';
import {
  arbitrum,
  arbitrumGoerli,
  aurora,
  avalanche,
  bsc,
  canto,
  celo,
  cronos,
  fantom,
  metis,
  moonbeam,
  moonriver,
  optimism,
  polygon,
  zkSync,
} from 'wagmi/chains';
import { rHottTokenAbi } from '../abis/rHottTokenAbi.ts';
import { getEnv } from '../../../lib/envVar.ts';

console.log('IS_MAINNET', getEnv('VITE_IS_MAINNET') === 'true');
export const CHAIN = mapChain(getEnv('VITE_IS_MAINNET') === 'true' ? 'arbitrum' : 'arbitrum-goerli') ?? 0;

export function mapChain(chain: string): number | null {
  switch (chain) {
    // case 'emerald': return 42262;
    // case 'fuse': return 122;
    // case 'kava': return 2222;
    case 'arbitrum':
      return arbitrum.id;
    case 'arbitrum-goerli':
      return arbitrumGoerli.id;
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

export type MulticallContractFunctionConfig = ContractFunctionConfig & { chainId: number };
function packContractCallsBeefy({
  userAddress,
  vaultAddress,
  depositTokenAddress,
  chainId,
}: {
  userAddress: `0x${string}`;
  vaultAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
  chainId: number | null;
}): MulticallContractFunctionConfig[] {
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

function packContractCallsFirepot({
  userAddress,
  usageAddress,
  depositTokenAddress,
  chainId,
}: {
  userAddress: `0x${string}`;
  usageAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
  chainId: number | null;
}): MulticallContractFunctionConfig[] {
  if (!chainId) chainId = 0; // forces a fail, but does not change array size from the opportunityData size
  return [
    // Reward vault balance
    {
      abi: rHottTokenAbi,
      address: depositTokenAddress,
      functionName: 'getUsageAllocation',
      args: [userAddress, usageAddress],
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
type VaultSource = 'beefy' | 'firepot';
export function useChainData(opportunityData: OpportunityData[], vaultSource: VaultSource): TokenBalances {
  const [chainData, setChainData] = useState<TokenBalances>(null);
  const { address } = useAccount();
  useEffect(() => {
    async function getDatData() {
      if (opportunityData.length == 0) return;
      if (!address) return;

      console.log('opportunityData', opportunityData);

      const contractReadConfig = opportunityData.flatMap((opportunity) => {
        switch (vaultSource) {
          case 'beefy': {
            return packContractCallsBeefy({
              userAddress: address,
              vaultAddress: opportunity.vaultAddress,
              depositTokenAddress: opportunity.depositTokenAddress,
              chainId: mapChain(opportunity.chain),
            });
          }
          case 'firepot': {
            return packContractCallsFirepot({
              userAddress: address,
              usageAddress: opportunity.vaultAddress,
              depositTokenAddress: opportunity.depositTokenAddress,
              chainId: mapChain(opportunity.chain),
            });
          }
        }
      });

      console.log('contractReadConfig', contractReadConfig);

      const data = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      console.log('data', data);

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
