import { useEffect, useState } from 'react';
import { 
  BeefyVaultData, 
  CATEGORIES, 
  MAX_SCORE, 
  OpportunityData, 
  RISKS, 
  Risks, 
  SafetyRank, 
  UseOpportunitiesOptions 
} from './types';

const calcRisk = (arr: Risks[]): number => {
  const categories = Object.fromEntries(Object.keys(CATEGORIES).map(c => [c, [] as Risks[]]));

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
    // @ts-ignore
    const w = CATEGORIES[c];
    risk += w * Math.min(
      1,
      categories[c].reduce((acc: number, r) => acc + RISKS[r].score, 0)
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
          const promises = [
              fetch('https://api.beefy.finance/vaults'),
              fetch('https://api.beefy.finance/apy'),
              fetch('https://api.beefy.finance/lps'),
          ]
        const [responseVaults, responseApy, responseLps] = await Promise.all(promises);
        if (!responseVaults.ok || !responseApy.ok || !responseLps.ok) {
            throw new Error('Failed to fetch data from API');
          }
        const opportunitiesData: BeefyVaultData[] = await responseVaults.json();
        const apyData: { [key: string]: number } = await responseApy.json();
        const lpsData: { [key: string]: number } = await responseLps.json();

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
            price: lpsData[opportunity.id],
            assets: opportunity.assets,
            platformId: opportunity.platformId,
            strategyTypeId: opportunity.strategyTypeId,
            safetyScore: `${safetyScoreRank}, ${safetyScoreNum}`,
            vaultAddress: opportunity.earnContractAddress,
            depositTokenAddress: opportunity.tokenAddress,
            tokenDecimals: opportunity.tokenDecimals,
            pricePerFullShare: opportunity.pricePerFullShare,
            addLiquidityUrl: opportunity.addLiquidityUrl,
            chain: opportunity.chain
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
