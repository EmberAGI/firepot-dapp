import './App.css'
import Opportunity from './features/SmartDiscovery/Opportunity';
import useOpportunityData from './features/SmartDiscovery/useOpportunities';

export default function Home() {
  const { opportunities, loading, error } = useOpportunityData({safetyRanks: ['high']});

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
      <div>
        {opportunities.map((vaultData, index) => (
          <Opportunity key={index} data={vaultData} />
        ))}
      </div>
  );
}
