import React, { useState, useEffect } from 'react';
import { BeefyVaultData, CATEGORIES, MAX_SCORE, RISKS } from './types';

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

const getSafetyScoreCategory = (score: number) => {
    if (score > 8.6) return 'high';
    if (score > 8.1) return 'medium';
    return 'low';
};

const useOpportunityData = () => {
    const [data, setData] = useState<BeefyVaultData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('https://api.beefy.finance/vaults').then(response => response.json()),
            fetch('https://api.beefy.finance/apy').then(response => response.json())
        ])
        .then(([opportunities, apyData]) => {
            const activeOpportunities = opportunities.filter((opportunity: BeefyVaultData) => opportunity.status === 'active' && Array.isArray(opportunity.risks));
            const simplifiedData = activeOpportunities.map((opportunity: BeefyVaultData) => {
                const safetyScoreNum = MAX_SCORE * (1 - calcRisk(opportunity.risks));
                const safetyScoreRank = getSafetyScoreCategory(safetyScoreNum);
                return {
                apy: apyData[opportunity.id],
                assets: opportunity.assets,
                platformId: opportunity.platformId,
                strategyTypeId: opportunity.strategyTypeId,
                safetyScore: safetyScoreRank + `, ${safetyScoreNum}`
                };
            });
            setData(simplifiedData);
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
