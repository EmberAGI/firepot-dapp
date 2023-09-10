import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { simplifiedAlgebraPoolAbi } from '../abis/AlgebraPool';

interface TokenPrice {
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  priceDenominationTokenAddress: `0x${string}`;
  priceDenominationSymbol: string;
  priceDenominationDecimals: number;
  pricePerToken: bigint;
}

const USDT_HOTT_ALGEBRA_POOL = '0xdb1ffe19a075f0ff73f6fe1f271f31a0c33b40fa';
const DEFAULT_DENOMINATION_TOKEN = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
const DEFAULT_DENOMINATION_SYMBOL = 'USDT';
const DEFAULT_DENOMINATION_DECIMALS = 6n;
const DEFAULT_DECIMALS = 18;

export function useAlgebraPoolTokenPrice(tokenAddress?: `0x${string}`, priceDenominationTokenAddress?: `0x${string}`): TokenPrice | undefined {
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | undefined>();

  const { data: poolState } = useContractRead({
        abi: simplifiedAlgebraPoolAbi,
        address: USDT_HOTT_ALGEBRA_POOL,
        functionName: 'globalState',
  });

  useEffect(() => {
    if (!tokenAddress || !poolState) {
      return;
    }

    setTokenPrice({
      tokenAddress,
      tokenDecimals: DEFAULT_DECIMALS,
      priceDenominationTokenAddress: priceDenominationTokenAddress ?? DEFAULT_DENOMINATION_TOKEN,
      priceDenominationSymbol: DEFAULT_DENOMINATION_SYMBOL,
      priceDenominationDecimals: DEFAULT_DECIMALS,
      pricePerToken: poolState[0] / ( 10n ** DEFAULT_DENOMINATION_DECIMALS), // price decimals are tokenDecimals + priceDenominationDecimals
    });
  }, [tokenAddress, priceDenominationTokenAddress]);

  return tokenPrice;
}
