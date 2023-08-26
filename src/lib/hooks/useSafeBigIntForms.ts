import { useMemo, useState } from 'react';

// Decides if formAmount is a number and if form should update or not
function safeAmountChange(formAmount: string, prevVal: string, nDecimals: number): string {
  if (isNaN(Number(formAmount))) {
    return prevVal;
  }
  let spltString = safeParseFloat(formAmount).split('.');
  if (spltString.length == 2 && spltString[1].length > nDecimals) {
    return `${spltString[0]}.${spltString[1].slice(0, nDecimals)}`;
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

function safeParseFloat(input: String): String {
  let spl = input.split('.');
  if (spl.length == 2 && spl[1].includes('e')) {
    let sple = spl[1].split('e');
    let decimalPart = sple[0];
    let exponent = Math.round(Number(sple[1]));
    if (exponent > 0) {
      for (let i = 0; i < exponent; ++i) {
        if (i >= decimalPart.length) {
          spl[0] += '0';
        } else {
          spl[0] += decimalPart.at(i);
        }
      }
      spl[1] = exponent >= decimalPart.length ? '0' : decimalPart.substring(exponent);
    } else if (exponent < 0) {
      let transferPart = '';
      let len = spl[0].length;
      for (let i = 0; i < -exponent; ++i) {
        transferPart = i >= len ? '0' : spl[0].at(len - 1 - i) + transferPart;
      }
      spl[0] = -exponent >= len ? '' : spl[0].substring(len + exponent);
      spl[1] = transferPart + decimalPart;
    } else {
      return spl[0] + '.' + decimalPart;
    }
  }
  return (spl[0].length > 0 ? spl[0].replace(/^0+/g, '') : '0') + '.' + (spl.length == 2 && spl[1].length > 0 ? spl[1] : '0');
}

export function bigintFromFormattedString(input: string, decimalPlaces: number) {
  let floatString = safeParseFloat(input);
  let spl = floatString.split('.');
  let wholePart = spl[0];
  let decimalPart = spl.length == 2 ? spl[0] : '';
  if (BigInt(wholePart) > 0n) {
    if (decimalPart.length > decimalPlaces) {
      decimalPart = decimalPart.substring(0, decimalPlaces);
    } else {
      decimalPart += '0'.repeat(decimalPlaces - decimalPart.length);
    }
  }
  return BigInt(wholePart.concat(decimalPart));
}

// Hook to manage form state converting form strings into uint256 bigint values for token inputs
export function useSafeBigIntForms(decimalPlaces: number) {
  const [formVal, unsafeSetFormVal] = useState('0.00');
  const amount: bigint = useMemo(() => bigintFromFormattedString(formVal, decimalPlaces), [formVal]);

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
