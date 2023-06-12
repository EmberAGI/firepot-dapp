import { formatBigInt } from '../../../lib/hooks/useSafeBigIntForms';
import styles from './depositAssetCard.module.css';

export default function DepositAssetCard({
  amount,
  usdAmount,
  setUsd,
  setMax,
  depositTokenBalance,
  tokenDecimals,
}: {
  amount: string;
  usdAmount: string;
  setUsd: (input: bigint | string) => void;
  setMax: () => void;
  depositTokenBalance: bigint | null;
  tokenDecimals: number;
}): JSX.Element {
  return (
    <div className={styles.depositAssetCard}>
      <div className={styles.depositElement}>
        <img
          src='https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a463d767ad43c565cd3_Vectors-Wrapper.svg'
          loading='lazy'
          width='30'
          height='30'
          alt=''
          className={styles.vectorsWrapper13}
        />
        <div className={styles.depositAmountInputWrapper}>
          <button className={styles.maxButton} onClick={() => setMax()}>
            <div className={styles.buttonText}>
              MAX
            </div>
          </button>
          <input
            className={styles.depositAmountInput}
            type='number'
            placeholder={'0.00'}
            onChange={(e) => setUsd(e.target.value)}
            value={usdAmount}
          />
          <div className={styles.returnText}>
            <div className={`${styles.returnText} ${styles.depositAmountText0}`}>
            USD
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tokenBalanceElement}>
        <div className={styles.tokenName3}>Bitcoin</div>
        <div className={styles.returnText}>
          <div className={`${styles.returnText} ${styles.tokenBalanceText0}`}>
            <span className={styles.tokenBalanceText0}>{amount}</span>
            <span className={styles.tokenBalanceText1}> / </span>
            <span className={styles.tokenBalanceText2}>{formatBigInt(depositTokenBalance ? depositTokenBalance : 0n, tokenDecimals)} BTC</span>
          </div>
        </div>
      </div>
      {/*<div className={styles.depositAmountBar}>
        <div className={styles.bar}>
          <img
            src='https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a47764d189352a3459b_Vectors-Wrapper.svg'
            loading='lazy'
            width='300'
            height='6'
            alt=''
            className={styles.vectorsWrapper14}
          />
        </div>
      </div>*/}
    </div>
  );
}
