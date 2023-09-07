/*import { useEffect, useState } from 'react';
import { erc20ABI, readContracts, useAccount } from 'wagmi';
import { MulticallContractFunctionConfig, mapChain } from '../BeefyVault/reads';
import { TokenParameter, useTokenPrices } from './useTokenPrices';

interface TokenBalance {
  [a: `0x${string}`]: {
    balance: bigint;
    decimals: number;
    priceDenominationBalance: bigint;
    priceDenominationSymbol: string;
    priceDenominationDecimals: number;
  };
}

export function useTokenBalances(tokenAddresses: `0x${string}`[]): TokenBalance | undefined {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | undefined>();
  const { address: accountAddress } = useAccount();
  // BUG: The token parameter array of objects causes an infinite loop
  //const tokenPrices = useTokenPrices(tokenAddresses.map((tokenAddress) => ({ tokenAddress } as TokenParameter)));

  /*useEffect(() => {
    if (tokenAddresses.length == 0 || !accountAddress || !tokenPrices) {
      return;
    }

    const getTokenBalance = async () => {
      //let contractReadConfig: MulticallContractFunctionConfig[] = [];
      const chainId = mapChain('arbitrum-goerli') ?? 0;

      const contractReadConfig: MulticallContractFunctionConfig[] = tokenAddresses.map((address) => ({
        abi: erc20ABI,
        address,
        functionName: 'balanceOf',
        args: [accountAddress],
        chainId,
      }));

      const readResponse = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      console.log('readResult', readResponse);

      const balances: TokenBalance = readResponse.reduce((acc, response, index) => {
        if (response.error) {
          console.error('totalAllocation', response.error);
          return acc;
        }

        const balance = response.result as bigint;
        const decimals = 18;

        return {
          ...acc,
          [tokenAddresses[index]]: {
            balance,
            decimals,
            priceDenominationBalance: balance * tokenPrices[index].pricePerToken,
            priceDenominationSymbol: tokenPrices[index].priceDenominationSymbol,
            priceDenominationDecimals: tokenPrices[index].priceDenominationDecimals,
          },
        };
      }, {});

      setTokenBalance(balances);
    };
    getTokenBalance();
  }, [tokenAddresses, accountAddress, tokenPrices]);

  return tokenBalance;
}*/
