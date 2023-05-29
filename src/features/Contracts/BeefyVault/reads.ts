import { erc20ABI, mainnet, readContracts, useAccount } from 'wagmi';
import { OpportunityData } from '../../SmartDiscovery/types';
import { useEffect, useState } from 'react';
import { ContractFunctionConfig } from 'viem';
import { arbitrum, aurora, avalanche, bsc, canto, celo, cronos, fantom, metis, moonbeam, moonriver, optimism, polygon, zkSync } from 'wagmi/chains';

function mapChain(chain: string): number | undefined {
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
  return undefined;
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
  chainId: number | undefined;
}): MultichainContractFunctionsConfig[] {
  if (chainId == undefined) chainId = 0; // forces a fail, but does not change array size from the opportunityData size
  return [
    // vault balance
    {
      abi: erc20ABI,
      address: vaultAddress,
      functionName: 'balanceOf',
      args: [userAddress],
      chainId,
    },
    // vault allowance
    {
      abi: erc20ABI,
      address: vaultAddress,
      functionName: 'allowance',
      args: [userAddress, vaultAddress],
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
    // depositToken allowance
    {
      abi: erc20ABI,
      address: depositTokenAddress,
      functionName: 'allowance',
      args: [userAddress, vaultAddress],
      chainId,
    },
  ];
}

export type ChainData =
  | {
      vaultTokenBalance: bigint;
      vaultTokenAllowance: bigint;
      depositTokenBalance: bigint;
      depositTokenAllowance: bigint;
    }[]
  | null;

export type ChainDataElem = {
  vaultTokenBalance: bigint;
  vaultTokenAllowance: bigint;
  depositTokenBalance: bigint;
  depositTokenAllowance: bigint;
};
export function useChainData(opportunityData: OpportunityData[]): ChainData {
  const [chainData, setChainData] = useState<ChainData>(null);
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
      console.log(opportunityData.length * 4);
      console.log(contractReadConfig.length);

      const data = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 0, // disables size limit
      });
      console.log(data.length);

      setChainData(
        data.reduce((reducer, _, index) => {
          if (index % 4 != 0) return reducer;
          reducer[index / 4] = {
            vaultTokenBalance: !data[index].error && data[index].result,
            vaultTokenAllowance: !data[index + 1].error && data[index + 1].result,
            depositTokenBalance: !data[index + 2].error &&  data[index + 2].result,
            depositTokenAllowance: !data[index + 3].error &&  data[index + 3].result,
          };
          return reducer;
        }, new Array(data.length / 4).fill(0n)),
      );
    }
    getDatData();
  }, [opportunityData, address]);
  return chainData;
}
