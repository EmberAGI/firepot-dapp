import { useMemo, useState } from 'react';

// Decides if formAmount is a number and if form should update or not
function safeAmountChange(formAmount: string, prevVal: string, nDecimals: number): string {
  if (isNaN(Number(formAmount)) || (formAmount.split('.').length > 1 && formAmount.split('.')[1].length > nDecimals)) {
    return prevVal;
  }
  return formAmount;
}

// provides number of leading zeros needed to display bigint decimals
function leadingZeros(bi: bigint, decimals: number): number {
    if (bi == 0n) return 1; // make number 0.00 by default
  let out = 0;
  for (let i = 0n; i < decimals - 1; i++) {
    bi /= 10n;
    if (bi != 0n) {
      ++out;
    } else {
      break;
    }
  }
  return out;
}

// breaks bigint into whole numbers and decimal parts
export function formatBigInt(bi: bigint, decimals: number): string {
  const divisor = BigInt('1' + '0'.repeat(decimals));
  const wholePart = bi / divisor;
  const decimalPart = bi % divisor;
  return wholePart.toString().concat('.', '0'.repeat(leadingZeros(decimalPart, decimals)), decimalPart.toString());
}

/// returned bigint is the max of the 2 bigints
export function addBigInt(a: bigint, aDecimals: number, b: bigint, bDecimals: number): bigint {
  if (aDecimals < bDecimals) {
    return a * 10n ** (BigInt(bDecimals) - BigInt(aDecimals)) + b;
  } else {
    return b * 10n ** (BigInt(aDecimals) - BigInt(bDecimals)) + a;
  }
}

// Hook to manage form state converting form strings into uint256 bigint values for token inputs
export function useSafeBigIntForms(decimalPlaces: number) {
  const [formVal, unsafeSetFormVal] = useState('0.00');
  const amount: bigint = useMemo(() => {
    let spl = formVal.split('.');
    let spl1 = '';
    if (spl.length > 1) {
      spl1 = `${spl[1]}${'0'.repeat(decimalPlaces - spl[1].length)}`;
    } else {
      spl1 = '0'.repeat(decimalPlaces);
    }
    return BigInt(spl[0].concat(spl1));
  }, [formVal]);

  const setFormVal = (val: string | bigint) => {
    if (typeof val == 'string') {
      unsafeSetFormVal(safeAmountChange(val, formVal, decimalPlaces));
    }
    if (typeof val == 'bigint') {
      unsafeSetFormVal(formatBigInt(val, decimalPlaces));
    }
  };

  return { amount, formVal, setFormVal };
}
