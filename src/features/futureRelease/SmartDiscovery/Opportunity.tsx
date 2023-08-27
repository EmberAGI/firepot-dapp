import React from 'react';
import { OpportunityData } from './types';
import styles from './Opportunity.module.css';
import safetyRankHigh from './safetyRankHigh.svg';
import TokenImage from '../../../components/TokenImage/TokenImage';
import { BeefyVault } from '../../Contracts/BeefyVault';
import { TokenBalanceElem } from '../../Contracts/BeefyVault/reads';

// @ts-ignore
const getAssetImage = (platformId: string, strategyTypeId: string) => {
  // Placeholder function: replace this with real image fetching logic.
  return '/images/Vectors-Wrapper_1.svg';
};

type OpportunityProps = {
  data: OpportunityData;
};

const Opportunity: React.FC<OpportunityProps> = ({ data }) => {
  // @ts-ignore
  const { id, apy, assets, platformId, strategyTypeId, safetyRank, vaultAddress, tokenDecimals } = data;
  const apyPercentage = (apy * 100).toFixed(2);

  return (
    <div className={styles.opportunity} key={id}>
      <div className={styles.safetyYield}>
        <div className={styles.safety}>
          <img src={safetyRankHigh} loading='lazy' alt='' className={styles.safetyVector} />
        </div>
        <div className={styles.yield}>
          <div className={styles.text}>{`${apyPercentage}%`}</div>
          <div className={styles.yieldLabel}>APY</div>
        </div>
      </div>
      <div className={styles.icon}>
        {assets[0]}
        <TokenImage symbol={assets[0]} />
      </div>
      <div className={styles.description}>
        <div className={styles.tokenName}>{`${assets.join(', ')}`}</div>
        <div className={styles.protocolDetails}>
          <div className={styles.text}>{`${platformId}・${strategyTypeId}`}</div>
        </div>
      </div>
    </div>
  );
};

export default Opportunity;
