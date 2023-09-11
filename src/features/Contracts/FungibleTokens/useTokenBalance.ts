import { useEffect, useState } from 'react';
import { erc20ABI, readContracts, useAccount } from 'wagmi';
import { CHAIN_ID, MulticallContractFunctionConfig } from '../BeefyVault/reads';
//import { useTokenPrice } from './useTokenPrice';
import { useAlgebraPoolTokenPrice } from './useAlgebraPoolTokenPrice';

export interface TokenBalance {
  [a: `0x${string}`]: {
    balance: bigint;
    decimals: number;
    priceDenominationBalance: bigint;
    priceDenominationSymbol: string;
    priceDenominationDecimals: number;
    pricePerToken: bigint;
  };
}

export const convertTokenBalance = (
  tokenAddress: `0x${string}`,
  tokenAmount: bigint,
  decimals: number,
  pricePerToken: bigint,
  priceDenominationSymbol: string,
  priceDenominationDecimals: number,
): TokenBalance => {
  return {
    [tokenAddress]: {
      balance: tokenAmount,
      decimals,
      priceDenominationBalance: (tokenAmount * pricePerToken) / BigInt(10 ** decimals),
      priceDenominationSymbol: priceDenominationSymbol,
      priceDenominationDecimals: priceDenominationDecimals,
      pricePerToken: pricePerToken,
    },
  };
};

export function useTokenBalance(tokenAddress: `0x${string}` | undefined): TokenBalance | undefined {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | undefined>();
  const { address: accountAddress } = useAccount();
  const tokenPrice = useAlgebraPoolTokenPrice(tokenAddress);

  useEffect(() => {
    if (!tokenAddress || !accountAddress || !tokenPrice) {
      return;
    }

    const getTokenBalance = async () => {
      //let contractReadConfig: MulticallContractFunctionConfig[] = [];
      const chainId = CHAIN_ID;
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
        const tokenBalance = convertTokenBalance(
          tokenAddress,
          balance,
          decimals,
          tokenPrice.pricePerToken,
          tokenPrice.priceDenominationSymbol,
          tokenPrice.priceDenominationDecimals,
        );

        return {
          ...acc,
          ...tokenBalance,
        };
      }, {});

      setTokenBalance(balance);
    };
    getTokenBalance();
  }, [tokenAddress, accountAddress, tokenPrice]);

  return tokenBalance;
}
