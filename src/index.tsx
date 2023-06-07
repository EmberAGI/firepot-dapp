import { Link } from 'react-router-dom';
import './App.css'
import { useChainData, defaultTokenBalance } from './features/Contracts/BeefyVault/reads';
import Opportunity from './features/SmartDiscovery/Opportunity';
import useOpportunityData from './features/SmartDiscovery/useOpportunities';
import './index.css';

export default function Home() {

  const { opportunities, loading, error } = useOpportunityData(
  // {safetyRanks: ['high']}
  );
  const tokenBalances = useChainData(opportunities);

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

  return (
      <div className='opportunities'>
        {limitedOpportunities.map((opportunity, index) => (
          <Link to={`/opportunities/${opportunity.id}`} state={{ opportunity: opportunity, tokenBalances: !tokenBalances ? defaultTokenBalance : tokenBalances[index] }} >
            <Opportunity key={index} data={opportunity} />
          </Link>
        ))}
      </div>
  );
}
