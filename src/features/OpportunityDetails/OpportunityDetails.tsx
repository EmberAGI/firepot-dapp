import { useLocation } from 'react-router-dom';
import { OpportunityData } from '../SmartDiscovery/types';
import { BeefyVault } from '../Contracts/BeefyVault';
import { TokenBalanceElem } from '../Contracts/BeefyVault/reads';

type LocationState = {
    opportunity: OpportunityData;
    tokenBalances: TokenBalanceElem | null;
}

export default function OpportunityDetails(): JSX.Element {
    const location = useLocation();
  const { opportunity, tokenBalances } = location.state as LocationState;
  const {
    id,
    apy,
    assets,
    platformId,
    strategyTypeId,
    safetyRank,
    vaultAddress,
    depositTokenAddress,
    tokenDecimals,
    chain,
  } = opportunity;

  return (
    <div>
      {/* TODO(AVK): Get actual maxDeposit={tokenBalance} maxWithdrawal={vaultTokenBalance}
      <BeefyVault vaultAddress={vaultAddress} tokenDecimals={tokenDecimals} tokenBalances={tokenBalances} depositTokenAddress={depositTokenAddress} /> */}
      
    </div>
  );
}