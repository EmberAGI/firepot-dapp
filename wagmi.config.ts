import { defineConfig } from '@wagmi/cli';
import { etherscan, react } from '@wagmi/cli/plugins';
import { erc20ABI } from 'wagmi';
import { optimism } from 'wagmi/chains';

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20ABI,
    },
  ],
  plugins: [
    etherscan({
      apiKey: 'YP9WWFW3SCUZKZNKYK7JB712SJ4UEYCW27',
      chainId: optimism.id,
      contracts: [
        {
          name: 'BeefyVault',
          address: {
            [optimism.id]: '0x2f0865133ce3ddb78953fd3b4f6505ef3adb2107',
          },
        },
      ],
    }),
    react(),
  ],
});
