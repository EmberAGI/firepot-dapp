export function safeAmountChange(formAmount: string, prevVal: string, nDecimals: number): string {
  if (isNaN(Number(formAmount)) || (formAmount.split('.').length > 1 && formAmount.split('.')[1].length > nDecimals)) {
    return prevVal;
  }
  return formAmount;
}
