import styles from './yieldVaultDetails.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { OpportunityData } from '../../SmartDiscovery/types';
import { TokenBalanceElem } from '../../Contracts/BeefyVault/reads';
import YieldVaultCard from './yieldVaultCard';
import DepositAssetCard from './depositAssetCard';
import { useEffect, useState } from 'react';
import { useSafeUsdAmountState } from '../../../lib/hooks/useSafeUsdAmountState';
import { useBeefyVaultDeposit } from '../../Contracts/BeefyVault/hooks';
import { useNetwork } from 'wagmi';

type LocationState = {
  opportunity: OpportunityData;
  tokenBalances: TokenBalanceElem | null;
};

export default function OpportunityDetails(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { opportunity, tokenBalances } = location.state as LocationState;
  const {
    addLiquidityUrl,
    apy,
    price,
    assets,
    platformId,
    vaultAddress,
    tokenDecimals,
  } = opportunity;

  const [tokenPrice, setTokenPrice] = useState(0);
  useEffect(() => {
    if (price) {
        setTokenPrice(price);
    }
  }, []);
  const { amount, formattedAmount, usdAmount, setUsd, setMax } = useSafeUsdAmountState({
    price: tokenPrice,
    depositTokenBalance: tokenBalances && tokenBalances.depositTokenBalance,
    tokenDecimals,
  });
  const { chain } = useNetwork();
  const { write } = useBeefyVaultDeposit(amount, { contractAddress: vaultAddress, chainId: chain ? chain.id : 0 });

  return (
    <div className={styles.yieldVaultDetails}>
      <div className={styles.header3}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img
            src='https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a43ae7fb3f99ecc5dd7_Vectors-Wrapper.svg'
            loading='lazy'
            width='24'
            height='24'
            alt=''
            className={styles.vectorsWrapper8}
          />
        </button>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>Yield Vault</div>
        </div>
        <div className={styles.vectorsWrapper9}></div>
      </div>
      <div className={styles.bodyContent}>
        <YieldVaultCard tokenName={`${assets.join(', ')}`} platform={platformId} vaultYield={apy} />
        <div className={styles.totalDepositSection}>
          <div className={styles.totalDepositContent}>
            <div className={styles.sectionLabelText}>Total Deposit</div>
            <div className={styles.returnText}>
              <div className={`${styles.returnText} ${styles.totalDepositAmount0}`}>
                <span className={styles.totalDepositAmount0}>$0.00</span>
                <span className={styles.totalDepositAmount1}> USD</span>
              </div>
            </div>
          </div>
          <div className={styles.totalDepositImage}>
            <img
              src='https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a45b93f1ffbd680a0e0_Vectors-Wrapper.svg'
              loading='lazy'
              width='64.62870788574219'
              height='72.75086975097656'
              alt=''
              className={styles.vectorsWrapper12}
            />
          </div>
        </div>
        <div className={styles.depositAssetsSection}>
          <div className={styles.frame2608175}>
            <div className={styles.sectionLabelText}>Deposit Asset</div>
          </div>
          <DepositAssetCard
            amount={formattedAmount}
            usdAmount={usdAmount}
            setUsd={setUsd}
            setMax={setMax}
            depositTokenBalance={tokenBalances && tokenBalances.depositTokenBalance}
            tokenDecimals={tokenDecimals}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <a href={addLiquidityUrl} target='_blank' className={styles.actions}>
          <button className={styles.primaryButton} disabled={false}>
            <div className={styles.buttonText2}>Get LP Tokens</div>
          </button>
        </a>
      </div>
      <div className={styles.actions}>
        <button className={styles.primaryButton} disabled={false} onClick={() => write?.()}>
          <div className={styles.buttonText2}>Deposit </div>
        </button>
      </div>
    </div>
  );
}
