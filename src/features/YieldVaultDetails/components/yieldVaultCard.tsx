import styles from "./yieldVaultCard.module.css";

export default function YieldVaultCard(): JSX.Element {
  return (
    <div className={styles.yieldVaultCard}>
        <div className={styles.yieldVaultHeader}>
            <img src="https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a442ace1257a9062ef3_Vectors-Wrapper.svg" loading="lazy" width="35.889122009277344" height="35.888877868652344" alt="" className={styles.vectorsWrapper10} />
            <div className={styles.returnRiskElement}>
                <div className={styles.returnLabel}>
                    <div className={styles.returnLabelText}>APR</div>
                </div>
                <div className={styles.returnRiskChip}>
                    <img src="https://uploads-ssl.webflow.com/6467c70a7fa40ab490fb689c/64827a455d40606d7c539ea7_Vectors-Wrapper.svg" loading="lazy" width="14" height="14" alt="" className={styles.vectorsWrapper11} />
                    <div className={styles.returnText}>
                        <div className={`${styles.returnText} ${styles.returnText0}`}><span className={styles.returnText0}>5.40</span><span className={styles.returnText1}>%</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.yieldVaultHeadline}>
            <div className={styles.frame46}>
                <div className={styles.tokenName2}>Bitcoin</div>
                <div className={styles.frame108}>
                    <div className={styles.text2}>Compound</div>
                </div>
            </div>
        </div>
        <div className={styles.yieldVaultHeadline}>
            <div className={styles.frame46}>
                <div className={styles.yieldVaultHeadline}>
                    <div className={styles.frame2608175}>
                        <div className={styles.text3}>Stake your Bitcoin in Compound’s premier yield farm and earn big today.</div>
                    </div>
                    <div className={styles.chainAirdao}>
                        <div className={styles.text4}>featured</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}