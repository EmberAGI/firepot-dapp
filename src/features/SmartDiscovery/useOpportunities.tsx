import { useEffect, useState } from 'react';
import { 
  BeefyVaultData, 
  CATEGORIES, 
  MAX_SCORE, 
  OpportunityData, 
  RISKS, 
  SafetyRank, 
  UseOpportunitiesOptions 
} from './types';

const calcRisk = (arr: string[]): number => {
  const categories = Object.fromEntries(Object.keys(CATEGORIES).map(c => [c, []]));

  arr.forEach(r => {
    if (!(r in RISKS)) {
      return;
    }

    const cat = RISKS[r].category;
    if (!(cat in CATEGORIES)) {
      return;
    }

    categories[cat].push(r);
  });

  let risk = 0;
  for (const c in CATEGORIES) {
    const w = CATEGORIES[c];
    risk += w * Math.min(
      1,
      categories[c].reduce((acc: number, r: number) => acc + RISKS[r].score, 0)
    );
  }

  return risk;
};

const getSafetyRank = (score: number): SafetyRank => {
  if (score > 8.6) return 'high';
  if (score > 8.1) return 'medium';
  return 'low';
};

const useOpportunityData = (options?: UseOpportunitiesOptions) => {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseVaults = await fetch('https://api.beefy.finance/vaults');
        const responseApy = await fetch('https://api.beefy.finance/apy');
        if (!responseVaults.ok || !responseApy.ok) {
            throw new Error('Failed to fetch data from API');
          }
        const opportunitiesData: BeefyVaultData[] = await responseVaults.json();
        const apyData: { [key: string]: number } = await responseApy.json();

        const activeOpportunities = opportunitiesData.filter(
          (opportunity: BeefyVaultData) => opportunity.status === 'active' && Array.isArray(opportunity.risks)
        );

        let filteredOpportunities = activeOpportunities;

        if (options?.safetyRanks) {
          filteredOpportunities = activeOpportunities.filter((opportunity: BeefyVaultData) => {
            const riskScore = MAX_SCORE * (1 - calcRisk(opportunity.risks));
            const safetyRank = getSafetyRank(riskScore);
            return options.safetyRanks?.includes(safetyRank);
          }); 
        }

        const simplifiedData: OpportunityData[] = filteredOpportunities.map((opportunity: BeefyVaultData) => {
          const safetyScoreNum = MAX_SCORE * (1 - calcRisk(opportunity.risks));
          const safetyScoreRank = getSafetyRank(safetyScoreNum);
          return {
            id: opportunity.id,
            apy: apyData[opportunity.id],
            assets: opportunity.assets,
            platformId: opportunity.platformId,
            strategyTypeId: opportunity.strategyTypeId,
            safetyScore: `${safetyScoreRank}, ${safetyScoreNum}`,
            vaultAddress: opportunity.earnContractAddress,
            tokenDecimals: opportunity.tokenDecimals,
          };
        });

        setOpportunities(simplifiedData);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [options]);

  return { opportunities, loading, error };
};

export default useOpportunityData;
