import { useEffect, useState } from 'react';

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

export function useTokenPrice(tokenAddress?: `0x${string}`, priceDenominationTokenAddress?: `0x${string}`): TokenPrice | undefined {
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | undefined>();

  useEffect(() => {
    if (!tokenAddress) {
      return;
    }

    setTokenPrice({
      tokenAddress,
      tokenDecimals: DEFAULT_DECIMALS,
      priceDenominationTokenAddress: priceDenominationTokenAddress ?? DEFAULT_DENOMINATION_TOKEN,
      priceDenominationSymbol: DEFAULT_DENOMINATION_SYMBOL,
      priceDenominationDecimals: DEFAULT_DECIMALS,
      pricePerToken: BigInt(TOKEN_PRICE_FRACTION * 10 ** DEFAULT_DECIMALS),
    });
  }, [tokenAddress, priceDenominationTokenAddress]);

  return tokenPrice;
}
