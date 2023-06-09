import styles from "./depositAssetCard.module.css";

export default function DepositAssetCard(): JSX.Element {
  return (
    <div className={styles.depositAssetCard}>
        <div className={styles.depositElement}><img src="https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a463d767ad43c565cd3_Vectors-Wrapper.svg" loading="lazy" width="30" height="30" alt="" className={styles.vectorsWrapper13} />
            <div className={styles.depositAmountInput}>
                <div className={styles.maxButton}>
                    <div className={styles.buttonText}>MAX</div>
                </div>
                <div className={styles.returnText}>
                    <div className={`${styles.returnText} ${styles.depositAmountText0}`}><span className={styles.depositAmountText0}>0.00</span><span className={styles.depositAmountText1}> </span><span className={styles.depositAmountText2}>USD</span></div>
                </div>
            </div>
        </div>
        <div className={styles.tokenBalanceElement}>
            <div className={styles.tokenName3}>Bitcoin</div>
            <div className={styles.returnText}>
                <div className={`${styles.returnText} ${styles.tokenBalanceText0}`}><span className={styles.tokenBalanceText0}>0.00</span><span className={styles.tokenBalanceText1}> / </span><span className={styles.tokenBalanceText2}>0.024 BTC</span></div>
            </div>
        </div>
        <div className={styles.depositAmountBar}>
            <div className={styles.bar}><img src="https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a47764d189352a3459b_Vectors-Wrapper.svg" loading="lazy" width="300" height="6" alt="" className={styles.vectorsWrapper14} /></div>
        </div>
    </div>
  );
}