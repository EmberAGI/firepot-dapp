import './App.css'
import Opportunity from './features/SmartDiscovery/Opportunity';
import useOpportunityData from './features/SmartDiscovery/useOpportunities';

const App: React.FC = () => {
  const { data, loading, error } = useOpportunityData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {data.map((vaultData, index) => (
        <Opportunity key={index} data={vaultData} />
      ))}
    </div>
  );
};

export default App
