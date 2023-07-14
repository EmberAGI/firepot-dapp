import { Link } from 'react-router-dom';
import { TokenBalanceElem, useChainData } from '../features/Contracts/BeefyVault/reads';
import Opportunity from '../features/SmartDiscovery/Opportunity';
import useOpportunityData from '../features/SmartDiscovery/useOpportunities';
import { Fragment, useMemo } from 'react';
import { OpportunityData } from '../features/SmartDiscovery/types';

function OpportunityMap({ positions }: { positions: { opportunity: OpportunityData; tokenBalanceData: TokenBalanceElem }[] }) {
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
  const tokenBalances = useChainData(opportunities);

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
    if (!opportunities || !tokenBalances) return null;
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

  const limitedOpportunities = opportunities.slice(0, 8);

  if (tokenBalances == null) {
    return (
      <div className='opportunities'>
        {limitedOpportunities.map((opportunity, index) => (
          <Link key={index} to={`/opportunities/${opportunity.id}`} state={{ opportunity: opportunity, tokenBalances: null }}>
            <Opportunity data={opportunity} />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <Fragment>
      {filteredUserPositions!.length > 0 && (
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
