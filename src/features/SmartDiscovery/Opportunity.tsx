import React from 'react';
import { BeefyVaultData } from './types';

type OpportunityProps = {
  data: BeefyVaultData;
};

const Opportunity: React.FC<OpportunityProps> = ({ data }) => {
    const apyPercentage = (data.apy * 100).toFixed(2);

  return (
    <div>
      <h2>APY: {apyPercentage}%</h2>
      <h3>Assets: {data.assets.join(', ')}</h3>
      <h4>Platform ID: {data.platformId}</h4>
      <h4>Strategy Type ID: {data.strategyTypeId}</h4>
      <h4>Safety Score: {data.safetyScore}</h4>
    </div>
  );
};

export default Opportunity;
