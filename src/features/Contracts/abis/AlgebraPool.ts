export const simplifiedAlgebraPoolAbi = [
  {
    inputs: [],
    name: 'globalState',
    outputs: [
      { internalType: 'uint160', name: 'price', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'feeZto', type: 'uint16' },
      { internalType: 'uint16', name: 'feeOtz', type: 'uint16' },
      { internalType: 'uint16', name: 'timepointIndex', type: 'uint16' },
      { internalType: 'uint8', name: 'communityFeeToken0', type: 'uint8' },
      { internalType: 'uint8', name: 'communityFeeToken1', type: 'uint8' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
