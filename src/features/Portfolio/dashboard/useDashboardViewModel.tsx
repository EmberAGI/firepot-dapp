import { useState } from 'react';

export interface DashboardViewModel {
  /*unstakedTokens: string;
  stakedTokens: string;
  showApproval: boolean;
  isApproved: boolean;
  pendingApproval: boolean;
  showAboveBalanceError: boolean;*/
}

type AssetElement = 'asset' | 'buy_token' | 'connect_wallet';

const initialViewModel = {
  totalBalance: '0',
  showLoading: true,
  showDiscover: false,
  showPositions: false,
  assetElement: 'connect_wallet' as AssetElement,
  truncatedWalletAddress: '0x…',
};

export default function useDashboardViewModel(initialState: DashboardViewModel = initialViewModel) {
  const [viewModel, setViewModel] = useState<DashboardViewModel>(initialState);
  /*const { userStakeBalance, stake } = useYieldFarmUserPosition(yieldFarmContractAddress);
  const { stakingTokenAddress } = useYieldFarmState(yieldFarmContractAddress);
  const { userBalance: stakingTokenUserBalance, decimals: stakingTokenDecimals } = useERC20Token(stakingTokenAddress);
  const [stakeAmount, setStakeAmount] = useState<string | undefined>();
  const { approvalRequired, isApproved, pendingApproval, approve } = useTokenApproval(
    stakeAmount,
    stakingTokenAddress,
    yieldFarmContractAddress
  );

  useEffect(() => {
    setViewModel((viewModel) => ({
      ...viewModel,
      unstakedTokens: stakingTokenUserBalance
        ? Number(formatUnits(stakingTokenUserBalance, stakingTokenDecimals)).toFixed(8).toString()
        : '0',
    }));
  }, [stakingTokenDecimals, stakingTokenUserBalance]);

  useEffect(() => {
    setViewModel((viewModel) => ({
      ...viewModel,
      stakedTokens: Number(formatUnits(userStakeBalance, stakingTokenDecimals)).toFixed(8).toString(),
    }));
  }, [stakingTokenDecimals, userStakeBalance]);*/

  return {
    viewModel,
  };
}
