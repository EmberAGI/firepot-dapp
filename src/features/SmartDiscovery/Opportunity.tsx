import React from 'react';
import { OpportunityData } from './types';

type OpportunityProps = {
  data: OpportunityData;
};

const Opportunity: React.FC<OpportunityProps> = ({ data }) => {
    const riskScore = data.risks ? data.risks.length : 0;

  return (
    <div>
      <p>APY: {data.apy}%</p>
      <p>Assets: {data.assets.join(', ')}</p>
      <p>Platform ID: {data.platformId}</p>
      <p>Strategy Type ID: {data.strategyTypeId}</p>
    </div>
  );
};

export default Opportunity;
