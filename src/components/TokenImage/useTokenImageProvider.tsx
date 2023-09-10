import { useState, useEffect } from 'react';
import { getEnv } from '../../lib/envVar';

interface Token {
  id: string;
  symbol: string;
  name: string;
}

interface TokenImage {
  thumb: string;
  small: string;
  large: string;
}

interface TokenDetails {
  image: TokenImage;
}

export default function useTokenImageProvider(symbol: string): string | null {
  const [tokenImage, setTokenImage] = useState<string | null>(null);
  const isDev = !getEnv('DEV');
  const corsAnywhereUrl = isDev ? 'https://cors-anywhere.herokuapp.com/' : '';
  const cryptoIconUrl = `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/120`;

  useEffect(() => {
    const fetchTokenImage = async () => {
      try {
        const cryptoIconsResponse = await fetch(`${corsAnywhereUrl}${cryptoIconUrl}`);

        if (!cryptoIconsResponse.ok) {
          throw new Error(`Image not found at cryptoicons API`);
        }

        // Set the original URL, not the CORS Anywhere URL
        setTokenImage(cryptoIconUrl);
        return;
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await fetch(`${corsAnywhereUrl}https://api.coingecko.com/api/v3/coins/list`);
        const tokens: Token[] = await response.json();
        const token = tokens.find((t) => t.symbol === symbol.toLowerCase());

        if (!token) {
          throw new Error(`Token with symbol ${symbol} not found`);
        }

        const detailsResponse = await fetch(`${corsAnywhereUrl}https://api.coingecko.com/api/v3/coins/${token.id}`);
        const details: TokenDetails = await detailsResponse.json();

        // Set the original URL, not the CORS Anywhere URL
        setTokenImage(details.image.large);
      } catch (error) {
        console.error(error);
        setTokenImage(null);
      }
    };

    fetchTokenImage();
  }, [symbol]);

  return tokenImage;
}
