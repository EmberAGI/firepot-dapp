export const simpleVaultAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_shares', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
  },
] as const;
