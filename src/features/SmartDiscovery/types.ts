export type OpportunityData = {
    id: string;
    name: string;
    token: string;
    tokenAddress: string;
    tokenDecimals: number;
    tokenProviderId: string;
    earnedToken: string;
    earnedTokenAddress: string;
    earnContractAddress: string;
    oracle: string;
    oracleId: string;
    status: string;
    platformId: string;
    assets: string[];
    strategyTypeId: string;
    risks: string[];
    addLiquidityUrl: string;
    network: string;
    createdAt: number;
    chain: string;
    strategy: string;
    lastHarvest: number;
    pricePerFullShare: string;
    apy: number;
  };
  