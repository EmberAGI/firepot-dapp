import { Link } from 'react-router-dom';
import { TokenBalanceElem, useChainData } from '../features/Contracts/BeefyVault/reads';
import Opportunity from '../features/futureRelease/SmartDiscovery/Opportunity';
import useOpportunityData from '../features/futureRelease/SmartDiscovery/useOpportunities';
import { Fragment, useMemo } from 'react';
import { OpportunityData } from '../features/futureRelease/SmartDiscovery/types';

function OpportunityMap({ positions }: { positions: { opportunity: OpportunityData; tokenBalanceData: TokenBalanceElem | null }[] }) {
  return (
    <div className='opportunities'>
      {positions!.slice(0, 8).map((position, index) => (
        <Link
          key={index}
          to={`/opportunities/${position.opportunity.id}`}
          state={{ opportunity: position.opportunity, tokenBalances: position.tokenBalanceData }}
        >
          <Opportunity data={position.opportunity} />
        </Link>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { opportunities, loading, error } = useOpportunityData();
  // {safetyRanks: ['high']}
  const tokenBalances = useChainData(opportunities, 'beefy');

  const filteredUserPositions = useMemo(() => {
    if (!opportunities || !tokenBalances) return null;
    return opportunities
      .filter((_, index) => tokenBalances[index].depositTokenBalance > 0n)
      .map((opp, index) => ({
        opportunity: opp,
        tokenBalanceData: tokenBalances[index],
      }));
  }, [opportunities, tokenBalances]);
  const filteredOtherPositions = useMemo(() => {
    if (!opportunities) return null;
    if (!tokenBalances) return opportunities.map((opp) => ({ opportunity: opp, tokenBalanceData: null }));
    return opportunities
      .filter((_, index) => tokenBalances[index].depositTokenBalance == 0n)
      .map((opp, index) => ({
        opportunity: opp,
        tokenBalanceData: tokenBalances[index],
      }));
  }, [opportunities, tokenBalances]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!opportunities) {
    return <div>No data available</div>;
  }

  return (
    <Fragment>
      {filteredUserPositions != null && filteredUserPositions.length > 0 && (
        <>
          <h1>Your Positions</h1>
          <OpportunityMap positions={filteredUserPositions!} />
        </>
      )}
      {filteredOtherPositions!.length > 0 && (
        <>
          <h1>Featured Opportunities</h1>
          <OpportunityMap positions={filteredOtherPositions!} />
        </>
      )}
    </Fragment>
  );
}
