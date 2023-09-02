import { useEffect, useState } from 'react';
import { erc20ABI, readContracts, useAccount } from 'wagmi';
import { MulticallContractFunctionConfig, mapChain } from '../BeefyVault/reads';
import { useTokenPrice } from './useTokenPrice';

interface TokenBalance {
  [a: `0x${string}`]: {
    balance: bigint;
    decimals: number;
    priceDenominationBalance: bigint;
    priceDenominationSymbol: string;
    priceDenominationDecimals: number;
  };
}

export function useTokenBalance(tokenAddress: `0x${string}` | undefined): TokenBalance | undefined {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | undefined>();
  const { address: accountAddress } = useAccount();
  const tokenPrice = useTokenPrice(tokenAddress);

  useEffect(() => {
    if (!tokenAddress || !accountAddress || !tokenPrice) {
      return;
    }

    const getTokenBalance = async () => {
      //let contractReadConfig: MulticallContractFunctionConfig[] = [];
      const chainId = mapChain('arbitrum-goerli') ?? 0;
      const contractReadConfig: MulticallContractFunctionConfig[] = [
        {
          abi: erc20ABI,
          address: tokenAddress,
          functionName: 'balanceOf',
          args: [accountAddress],
          chainId,
        },
      ];
      const readResponse = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      console.log('readResult', readResponse);

      const balance: TokenBalance = readResponse.reduce((acc, response) => {
        if (response.error) {
          console.error('totalAllocation', response.error);
          return acc;
        }

        const balance = response.result as bigint;
        const decimals = 18;

        return {
          ...acc,
          [tokenAddress]: {
            balance,
            decimals,
            priceDenominationBalance: (balance * tokenPrice.pricePerToken) / BigInt(10 ** decimals),
            priceDenominationSymbol: tokenPrice.priceDenominationSymbol,
            priceDenominationDecimals: tokenPrice.priceDenominationDecimals,
          },
        };
      }, {});

      setTokenBalance(balance);
    };
    getTokenBalance();
  }, [tokenAddress, accountAddress, tokenPrice]);

  return tokenBalance;
}
