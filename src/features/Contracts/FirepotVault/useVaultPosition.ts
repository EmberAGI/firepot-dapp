import { useEffect, useState } from 'react';
import { readContracts, useAccount } from 'wagmi';
import { CHAIN_ID, MulticallContractFunctionConfig } from '../BeefyVault/reads';
import { rewardsAbi } from '../abis/rewardsAbi';
import { TokenParameter, useTokenPrices } from '../FungibleTokens/useTokenPrices';
import { getEnv } from '../../../lib/envVar';

interface VaultPosition {
  vaultAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
  depositTokenDecimals: number;
  depositTokenTradeUrl: string;
  totalBalance: bigint;
  apy: string;
  accountDetails?: {
    balance: bigint;
    priceDenominationBalance: bigint;
    priceDenominationDecimals: number;
    priceDenominationSymbol: string;
    vaultRewardsTokenReturn: bigint;
  };
}

interface RewardsInfo {
  currentDistributionAmount: bigint; // total amount to distribute during the current cycle
  currentCycleDistributedAmount: bigint; // amount already distributed for the current cycle (times 1e2)
  pendingAmount: bigint; // total amount in the pending slot, not distributed yet
  distributedAmount: bigint; // total amount that has been distributed since initialization
  accRewardsPerShare: bigint; // accumulated rewards per share (times 1e18)
  lastUpdateTime: bigint; // last time the rewards distribution occurred
  cycleRewardsPercent: bigint; // fixed part of the pending rewards to assign to currentDistributionAmount on every cycle
  distributionDisabled: boolean; // deactivate a token distribution (for temporary rewards)
}

const REWARDS_TOKEN = (
  getEnv('VITE_IS_MAINNET') === 'true' ? getEnv('VITE_MAINNET_RHOTT_CONTRACT_ADDRESS') : getEnv('VITE_TESTNET_RHOTT_CONTRACT_ADDRESS')
) as `0x${string}`;
const TOKEN_PARAMETERS: TokenParameter[] = [{ tokenAddress: REWARDS_TOKEN }];

export function useVaultPosition(vaultAddress: `0x${string}`): VaultPosition | undefined {
  const [vaultPosition, setVaultPosition] = useState<VaultPosition | undefined>();
  const { address } = useAccount();
  const tokenPrice = useTokenPrices(TOKEN_PARAMETERS); // Can't input the object directly or it will run this hook in an infinite loop
  //const tokenPrice = useTokenPrices([{ tokenAddress: REWARDS_TOKEN }]);

  useEffect(() => {
    console.log('REWARDS_TOKEN', REWARDS_TOKEN);
    console.log('tokenPrice', tokenPrice);
    if (!address || !tokenPrice) {
      return;
    }

    console.log('useVaultPosition - vaultAddress', vaultAddress);

    const getVaultPosition = async () => {
      const chainId = CHAIN_ID;
      let contractReadConfig: MulticallContractFunctionConfig[] = [
        {
          abi: rewardsAbi,
          address: vaultAddress,
          functionName: 'totalAllocation',
          chainId,
        },
        {
          abi: rewardsAbi,
          address: vaultAddress,
          functionName: 'rewardsInfo',
          args: [REWARDS_TOKEN],
          chainId,
        },
        {
          abi: rewardsAbi,
          address: vaultAddress,
          functionName: 'usersAllocation',
          args: [address],
          chainId,
        },
      ];

      const readResponse = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      console.log('useVaultPosition - readResponse', readResponse);

      const totalAllocation = !readResponse[0].error ? (readResponse[0].result as bigint) : 0n;

      type RewardsInfoResult = [bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean];
      const rewardsInfoResult = !readResponse[1].error ? (readResponse[1].result as RewardsInfoResult) : undefined;
      const rewardsInfo: RewardsInfo | undefined = rewardsInfoResult
        ? {
            currentDistributionAmount: rewardsInfoResult[0],
            currentCycleDistributedAmount: rewardsInfoResult[1],
            pendingAmount: rewardsInfoResult[2],
            distributedAmount: rewardsInfoResult[3],
            accRewardsPerShare: rewardsInfoResult[4],
            lastUpdateTime: rewardsInfoResult[5],
            cycleRewardsPercent: rewardsInfoResult[6],
            distributionDisabled: rewardsInfoResult[7],
          }
        : undefined;

      const usersAllocation = !readResponse[2].error ? (readResponse[2].result as bigint) : undefined;

      if (!rewardsInfo) {
        return;
      }

      const apy = totalAllocation != 0n ? (Number(rewardsInfo.currentDistributionAmount) / Number(totalAllocation) / 7) * 365 * 100 : 0;
      const accountDetails = usersAllocation
        ? {
            balance: usersAllocation,
            priceDenominationBalance: usersAllocation * tokenPrice[0].pricePerToken,
            priceDenominationDecimals: tokenPrice[0].priceDenominationDecimals,
            priceDenominationSymbol: tokenPrice[0].priceDenominationSymbol,
            vaultRewardsTokenReturn: 0n,
          }
        : undefined;

      setVaultPosition({
        vaultAddress,
        depositTokenAddress: tokenPrice[0].tokenAddress,
        depositTokenDecimals: tokenPrice[0].tokenDecimals,
        depositTokenTradeUrl: getEnv('VITE_BUY_HOTT_URL'),
        totalBalance: totalAllocation,
        apy: apy.toFixed(2),
        accountDetails,
      });
    };
    getVaultPosition();
  }, [vaultAddress, address, tokenPrice]);

  return vaultPosition;
}
