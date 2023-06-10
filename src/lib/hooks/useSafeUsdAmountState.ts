import { useState } from 'react';
import { formatBigInt, useSafeBigIntForms } from './useSafeBigIntForms';

export function useSafeUsdAmountState({
  price,
  depositTokenBalance,
  tokenDecimals,
}: {
  price: number | null;
  depositTokenBalance: bigint | null;
  tokenDecimals: number;
}) {
  const { amount, formVal: formattedAmount, setFormVal: setTokenAmount } = useSafeBigIntForms(tokenDecimals);
  const [usdAmount, setUsdAmount] = useState('');
  function setMax() {
    // For testing purposes, uncomment following line
    // depositTokenBalance = BigInt(10) ** BigInt(18);
    if (!price || !depositTokenBalance) return;
    if (!price) return;
    setUsd(depositTokenBalance);
  }

  function setUsd(input: string | bigint) {
    if (typeof input == 'string') {
      if (isNaN(Number(input))) return;
      let spl = input.split('.');
      if (spl.length > 1 && spl[1].length > 2) return;
      if (!price) return; // only allow reactivity after price is known
      if (BigInt(input.split('.')[0]) * 100n > BigInt(Number.MAX_VALUE)) return; // Avoid number overflow
      setUsdAmount(input);
      setTokenAmount((parseFloat(input) / price).toString());
    } else if (typeof input === 'bigint') {
      if (!price) return;
      setUsdAmount(priceMath(input, price));
      setTokenAmount(input);
    }
  }

  function priceMath(input: bigint, price: number): string {
    let spl = price.toString().split('.');
    let priceDecimals;
    let bigintPrice;
    if (spl.length == 1) {
      priceDecimals = 0;
      bigintPrice = BigInt(spl[0]);
    } else {
      priceDecimals = spl[1].length;
      bigintPrice = BigInt(`${spl[0]}${spl[1]}`);
    }
    return formatBigInt((input * bigintPrice) / BigInt(10 ** priceDecimals), tokenDecimals);
  }

  return { amount, formattedAmount, usdAmount, setUsd, setMax };
}
