import { readContracts, useAccount } from 'wagmi';
import { TokenBalance, convertTokenBalance, useTokenBalance } from '../FungibleTokens/useTokenBalance';
import { CHAIN, MulticallContractFunctionConfig } from '../BeefyVault/reads';
import { rHottTokenAbi } from '../abis/rHottTokenAbi';
import { useEffect, useState } from 'react';
import { useTokenPrice } from '../FungibleTokens/useTokenPrice';
import { getEnv } from '../../../lib/envVar';

interface RedeemDetails {
  hottReceiveAmount: bigint;
  rHottRedeemAmount: bigint;
  endTime: Date;
  rewardsAddress: `0x${string}`;
  rewardsAllocation: bigint;
}

interface RHottAccountDetails {
  unallocatedBalance: TokenBalance;
  allocatedBalance: TokenBalance;
  redeemingBalance: TokenBalance;
  activeRedeems: RedeemDetails[];
}

interface RHottDetails {
  hottAddress: `0x${string}`;
  rHottAddress: `0x${string}`;
  rHottAccountDetails: RHottAccountDetails;
}

const RHOTT_ADDRESS = (
  getEnv('VITE_IS_MAINNET') === 'true' ? getEnv('VITE_MAINNET_RHOTT_CONTRACT_ADDRESS') : getEnv('VITE_TESTNET_RHOTT_CONTRACT_ADDRESS')
) as `0x${string}`;

export function useRHottDetails(): RHottDetails | undefined {
  const [rHottDetails, setRHottDetails] = useState<RHottDetails | undefined>();
  const [hottAddress, setHottAddress] = useState<`0x${string}` | undefined>();
  const unallocatedBalance = useTokenBalance(RHOTT_ADDRESS);
  const [allocatedBalance, setAllocatedBalance] = useState<TokenBalance | undefined>();
  const [redeemingBalance, setRedeemingBalance] = useState<TokenBalance | undefined>();
  const [activeRedeems, setActiveRedeems] = useState<RedeemDetails[] | undefined>();

  const { address: accountAddress } = useAccount();
  const [redeemCount, setRedeemCount] = useState<number | undefined>();
  const [chainId, setChainId] = useState<number>(0);
  const tokenPrice = useTokenPrice(RHOTT_ADDRESS);

  useEffect(() => {
    setChainId(CHAIN);
  }, []);

  useEffect(() => {
    if (!accountAddress || !chainId) {
      return;
    }

    const getRedeemCount = async () => {
      const contractReadConfig: MulticallContractFunctionConfig[] = [
        {
          abi: rHottTokenAbi,
          address: RHOTT_ADDRESS,
          functionName: 'getUserRedeemsLength',
          args: [accountAddress],
          chainId,
        },
      ];
      const readResponse = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      console.log('getRedeemCount readResponse', readResponse);

      if (readResponse[0].error) {
        console.error('readResponse[0].error', readResponse[0].error);
        return;
      }

      setRedeemCount(readResponse[0].result as number);
    };
    getRedeemCount();
  }, [accountAddress, chainId]);

  useEffect(() => {
    if (redeemCount == null || !tokenPrice) {
      return;
    }

    const getRHottDetails = async () => {
      const contractReadConfig: MulticallContractFunctionConfig[] = [
        {
          abi: rHottTokenAbi,
          address: RHOTT_ADDRESS,
          functionName: 'getRHottBalance',
          args: [accountAddress],
          chainId,
        },
        {
          abi: rHottTokenAbi,
          address: RHOTT_ADDRESS,
          functionName: 'hottToken',
          chainId,
        },
      ];

      for (let i = 0; i < redeemCount; i++) {
        contractReadConfig.push({
          abi: rHottTokenAbi,
          address: RHOTT_ADDRESS,
          functionName: 'getUserRedeem',
          args: [accountAddress, i],
          chainId,
        });
      }

      const readResponse = await readContracts({
        contracts: contractReadConfig as any[],
        batchSize: 100000, // disables size limit
      });

      console.log('getRHottDetails readResponse', readResponse);

      interface RHottBalances {
        allocatedAmount: bigint;
        redeemingAmount: bigint;
      }

      let rHottBalances: RHottBalances;
      if (readResponse[0].error) {
        console.error('readResponse[0].error', readResponse[0].error);
        return;
      } else {
        const result = readResponse[0].result as [bigint, bigint];
        rHottBalances = {
          allocatedAmount: result[0],
          redeemingAmount: result[1],
        };
      }

      let hottAddress: `0x${string}`;
      if (readResponse[1].error) {
        console.error('readResponse[1].error', readResponse[1].error);
        return;
      } else {
        hottAddress = readResponse[1].result as `0x${string}`;
        setHottAddress(hottAddress);
      }

      const activeRedeems: RedeemDetails[] = readResponse.reduce((acc, response, index) => {
        if (index < 2) {
          return acc;
        }

        if (response.error) {
          console.error('getUserRedeem', response.error);
          return acc;
        }

        const result = response.result as {
          hottAmount: bigint;
          rHottAmount: bigint;
          endTime: number;
          rewardsAddress: `0x${string}}`;
          rewardsAllocation: bigint;
        };

        acc.push({
          hottReceiveAmount: result.hottAmount,
          rHottRedeemAmount: result.rHottAmount,
          endTime: new Date(result.endTime),
          rewardsAddress: result.rewardsAddress,
          rewardsAllocation: result.rewardsAllocation,
        });

        return acc;
      }, [] as RedeemDetails[]);

      setActiveRedeems(activeRedeems);

      setAllocatedBalance(
        convertTokenBalance(
          RHOTT_ADDRESS,
          rHottBalances.allocatedAmount,
          18,
          tokenPrice.pricePerToken,
          tokenPrice.priceDenominationSymbol,
          tokenPrice.priceDenominationDecimals,
        ),
      );

      setRedeemingBalance(
        convertTokenBalance(
          RHOTT_ADDRESS,
          rHottBalances.redeemingAmount,
          18,
          tokenPrice.pricePerToken,
          tokenPrice.priceDenominationSymbol,
          tokenPrice.priceDenominationDecimals,
        ),
      );
    };
    getRHottDetails();
  }, [redeemCount, tokenPrice]);

  useEffect(() => {
    if (!hottAddress || !unallocatedBalance || !allocatedBalance || !redeemingBalance || !activeRedeems) {
      return;
    }

    setRHottDetails({
      hottAddress,
      rHottAddress: RHOTT_ADDRESS,
      rHottAccountDetails: {
        unallocatedBalance,
        allocatedBalance,
        redeemingBalance,
        activeRedeems,
      },
    });
  }, [hottAddress, unallocatedBalance, allocatedBalance, redeemingBalance, activeRedeems]);

  return rHottDetails;
}
