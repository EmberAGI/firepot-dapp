import React, { useState, useEffect } from 'react';
import { OpportunityData } from './types';


const useOpportunityData = () => {
  const [data, setData] = useState<OpportunityData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Promise.all([
        fetch('https://api.beefy.finance/vaults').then(response => response.json()),
        fetch('https://api.beefy.finance/apy').then(response => response.json())
      ])
      .then(([opportunities, apyData]) => {
        const mergedData = opportunities.map((opportunity: OpportunityData) => ({
          ...opportunity,
          apy: apyData[opportunity.id]
        }));
        setData(mergedData);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default useOpportunityData;
