import { useEffect, useState } from 'react';
import { readContracts, useAccount } from 'wagmi';
import { MulticallContractFunctionConfig, mapChain } from '../BeefyVault/reads';
import { rewardsAbi } from '../abis/rewardsAbi';
import { TokenParameter, useTokenPrices } from '../FungibleTokens/useTokenPrices';

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

interface DividendsInfo {
  currentDistributionAmount: bigint; // total amount to distribute during the current cycle
  currentCycleDistributedAmount: bigint; // amount already distributed for the current cycle (times 1e2)
  pendingAmount: bigint; // total amount in the pending slot, not distributed yet
  distributedAmount: bigint; // total amount that has been distributed since initialization
  accDividendsPerShare: bigint; // accumulated dividends per share (times 1e18)
  lastUpdateTime: bigint; // last time the dividends distribution occurred
  cycleDividendsPercent: bigint; // fixed part of the pending dividends to assign to currentDistributionAmount on every cycle
  distributionDisabled: boolean; // deactivate a token distribution (for temporary dividends)
}

const REWARDS_TOKEN = '0xf39e5FCc99565A65953d7ffb195394d968E0f872';
const TOKEN_PARAMETERS: TokenParameter[] = [{ tokenAddress: REWARDS_TOKEN }];

export function useVaultPosition(vaultAddress: `0x${string}`): VaultPosition | undefined {
  const [vaultPosition, setVaultPosition] = useState<VaultPosition | undefined>();
  const { address } = useAccount();
  const tokenPrice = useTokenPrices(TOKEN_PARAMETERS); // Can't input the object directly or it will run this hook in an infinite loop
  //const tokenPrice = useTokenPrices([{ tokenAddress: REWARDS_TOKEN }]);

  useEffect(() => {
    if (!address || !tokenPrice) {
      return;
    }

    const getVaultPosition = async () => {
      const chainId = mapChain('arbitrum-goerli') ?? 0;
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
          functionName: 'dividendsInfo',
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

      const totalAllocation = !readResponse[0].error ? (readResponse[0].result as bigint) : undefined;

      type DividendsInfoResult = [bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean];
      const dividendsInfoResult = !readResponse[1].error ? (readResponse[1].result as DividendsInfoResult) : undefined;
      const dividendsInfo: DividendsInfo | undefined = dividendsInfoResult
        ? {
            currentDistributionAmount: dividendsInfoResult[0],
            currentCycleDistributedAmount: dividendsInfoResult[1],
            pendingAmount: dividendsInfoResult[2],
            distributedAmount: dividendsInfoResult[3],
            accDividendsPerShare: dividendsInfoResult[4],
            lastUpdateTime: dividendsInfoResult[5],
            cycleDividendsPercent: dividendsInfoResult[6],
            distributionDisabled: dividendsInfoResult[7],
          }
        : undefined;

      const usersAllocation = !readResponse[2].error ? (readResponse[2].result as bigint) : undefined;

      if (!totalAllocation || !dividendsInfo) {
        return;
      }

      const apy = (Number(dividendsInfo.currentDistributionAmount) / Number(totalAllocation) / 7) * 365 * 100;
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
        depositTokenTradeUrl: import.meta.env.BUY_HOTT_URL!,
        totalBalance: totalAllocation,
        apy: apy.toFixed(2),
        accountDetails,
      });
    };
    getVaultPosition();
  }, [vaultAddress, address, tokenPrice]);

  return vaultPosition;
}
