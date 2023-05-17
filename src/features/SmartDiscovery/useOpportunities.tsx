import React, { useState, useEffect } from 'react';
import { BeefyVaultData, CATEGORIES, MAX_SCORE, OpportunityData, RISKS, SafetyRank, UseOpportunitiesOptions } from './types';

const calcRisk = (arr: string[]) => {
const categories = {};
for (const c in CATEGORIES) {
    categories[c] = [];
}

// reverse lookup
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

// reduce & clamp
let risk = 0;
for (const c in CATEGORIES) {
    const w = CATEGORIES[c];
    risk +=
    w *
    Math.min(
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
        Promise.all([
            fetch('https://api.beefy.finance/vaults').then(response => response.json()),
            fetch('https://api.beefy.finance/apy').then(response => response.json())
        ])
        .then(([opportunities, apyData]) => {
            const activeOpportunities = opportunities.filter((opportunity: BeefyVaultData) => opportunity.status === 'active' && Array.isArray(opportunity.risks));
            let filteredOpportunities = activeOpportunities;

            if (options != undefined && options?.safetyRanks != undefined) {
                filteredOpportunities = activeOpportunities.filter((opportunity: BeefyVaultData) => {
                    const riskScore = MAX_SCORE * (1 - calcRisk(opportunity.risks));
                    const safetyRank = getSafetyRank(riskScore);
                    return options.safetyRanks.includes(safetyRank);
                }); 
            }
            
            const simplifiedData = filteredOpportunities.map((opportunity: BeefyVaultData) => {
                const safetyScoreNum = MAX_SCORE * (1 - calcRisk(opportunity.risks));
                const safetyScoreRank = getSafetyRank(safetyScoreNum);
                return {
                apy: apyData[opportunity.id],
                assets: opportunity.assets,
                platformId: opportunity.platformId,
                strategyTypeId: opportunity.strategyTypeId,
                safetyScore: safetyScoreRank + `, ${safetyScoreNum}`
                };
            });
            setOpportunities(simplifiedData);
            setLoading(false);
        })
        .catch((error: Error) => {
            setError(error);
            setLoading(false);
        });
    }, []);

    return { opportunities, loading, error };
};

export default useOpportunityData;
