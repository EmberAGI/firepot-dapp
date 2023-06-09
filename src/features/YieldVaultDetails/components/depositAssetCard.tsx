import { useEffect, useMemo } from 'react';
import { formatBigInt, useSafeBigIntForms } from '../../../lib/hooks/useSafeBigIntForms';
import styles from './depositAssetCard.module.css';

export default function DepositAssetCard({
  tokenDecimals,
  depositTokenBalance,
  price,
}: {
  tokenDecimals: number;
  depositTokenBalance: bigint | null;
  price: number | null;
}): JSX.Element {
  // fetch price
  const { formVal: formattedAmount, setFormVal: setTokenAmount } = useSafeBigIntForms(tokenDecimals);

  function setMax() {
    if (!price || !depositTokenBalance) return;
    // 1. bigint amount is set equal to depositTokenBalance
    //  a) bigint amount is parsed to formattedAmount based on tokenDecimals
    //  b) formattedAmount is used as the numerator
    setTokenAmount(depositTokenBalance);
    // USD should react accordingly
  }

  function setUsd(input: string) {
    if (!price || isNaN(Number(input)) || (input.split('.').length > 1 && input.split('.')[1].length > tokenDecimals)) return;
      //console.log(price);
    // 1. formattedAmount = string(usd / price)
    setTokenAmount((parseFloat(input) / price).toString());
    // USD should react accordingly
  }

  const usdAmount = useMemo(() => {
    if (!price || !formattedAmount) return;
    return (parseFloat(formattedAmount) * price).toFixed(2);
  }, [formattedAmount, price]);

  useEffect(()=>console.log(usdAmount),[usdAmount]);

  ////// USER INPUTS IN USD
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
        <div className={styles.depositAmountInput}>
          <div className={styles.maxButton}>
            <div className={styles.buttonText} onClick={() => setMax()}>
              MAX
            </div>
          </div>
          <input
            type='text'
            placeholder={"0.00"}
            style={{ textAlign: 'right' }} // TODO: TOM CHANGE TO CSS
            onChange={(e) => setUsd(e.target.value)}
            value={usdAmount}
          />
          <div className={styles.returnText}>
            <div className={`${styles.returnText} ${styles.depositAmountText0}`}>
              {/* <span className={styles.depositAmountText0}>{usdAmount}</span>
                            <span className={styles.depositAmountText1}> </span> */}
              <span className={styles.depositAmountText2}>USD</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tokenBalanceElement}>
        <div className={styles.tokenName3}>Bitcoin</div>
        <div className={styles.returnText}>
          <div className={`${styles.returnText} ${styles.tokenBalanceText0}`}>
            <span className={styles.tokenBalanceText0}>{formattedAmount}</span>
            <span className={styles.tokenBalanceText1}> / </span>
            <span className={styles.tokenBalanceText2}>{formatBigInt(depositTokenBalance ? depositTokenBalance : 0n, tokenDecimals)} BTC</span>
          </div>
        </div>
      </div>
      <div className={styles.depositAmountBar}>
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
      </div>
    </div>
  );
}
