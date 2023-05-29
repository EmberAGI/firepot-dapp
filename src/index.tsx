import { useEffect } from 'react';
import './App.css'
import { useChainData } from './features/Contracts/BeefyVault/reads';
import Opportunity from './features/SmartDiscovery/Opportunity';
import useOpportunityData from './features/SmartDiscovery/useOpportunities';
import './index.css';

export default function Home() {
  const { opportunities, loading, error } = useOpportunityData(
  // {safetyRanks: ['high']}
  );
  const chainData = useChainData(opportunities);
  useEffect(()=> console.log(chainData));

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
        {limitedOpportunities.map((vaultData, index) => (
          <Opportunity key={index} data={vaultData} chainData={chainData && chainData[index]} />
        ))}
      </div>
  );
}
