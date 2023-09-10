import { useEffect, useMemo, useState } from 'react';

export interface TokenParameter {
  tokenAddress: `0x${string}`;
  priceDenominationTokenAddress?: `0x${string}`;
}

interface TokenPrice {
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  priceDenominationTokenAddress: `0x${string}`;
  priceDenominationSymbol: string;
  priceDenominationDecimals: number;
  pricePerToken: bigint;
}

const DEFAULT_DENOMINATION_TOKEN = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
const DEFAULT_DENOMINATION_SYMBOL = 'USDT';
const DEFAULT_DECIMALS = 18;
const TOKEN_PRICE_FRACTION = 0.005;

// BUG: The token parameter array of objects causes an infinite loop
export function useTokenPrices(parameters: TokenParameter[]): TokenPrice[] | undefined {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[] | undefined>();
  const memoParameters = useMemo(() => parameters, [parameters]);

  useEffect(() => {
    const prices: TokenPrice[] = memoParameters.map((parameter) => {
      const { tokenAddress, priceDenominationTokenAddress } = parameter;
      return {
        tokenAddress,
        tokenDecimals: DEFAULT_DECIMALS,
        priceDenominationTokenAddress: priceDenominationTokenAddress ?? DEFAULT_DENOMINATION_TOKEN,
        priceDenominationSymbol: DEFAULT_DENOMINATION_SYMBOL,
        priceDenominationDecimals: DEFAULT_DECIMALS,
        pricePerToken: BigInt(TOKEN_PRICE_FRACTION * 10 ** DEFAULT_DECIMALS),
      };
    });

    setTokenPrices(prices);
  }, [memoParameters]);

  return tokenPrices;
}
