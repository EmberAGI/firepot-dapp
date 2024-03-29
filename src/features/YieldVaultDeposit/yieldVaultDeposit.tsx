import HeaderBackButton from '../../components/shared/HeaderBackButton/headerBackButton';
import styles from './yield.module.scss';
import Button from '../../components/shared/Button/Button';

function action() {}

function YieldVaultDeposit() {
  return (
    <>
      <main className={styles.mainBox}>
        <HeaderBackButton title='Yield Vault Deposit' />
        <section className={styles.sectionBox}>
          <div className={styles.cardWhiteContainer}>
            <div className={styles.firstSection}>
              <img src='/assets/firepot-blue-logo.svg' loading='lazy' alt='' />
              <div className={styles.currencyBox}>
                <img src='/assets/verify.svg' loading='lazy' alt='' />
                <span className={styles.percentage}>20.44%</span>
                <span className={styles.currency}>APY</span>
              </div>
            </div>
            <div className={styles.secondSection}>
              <span className={styles.title}>Firepot (HOTT)</span>
              <span className={styles.subtitle}>Firepot Earn</span>
            </div>
            <div className={styles.thirdSection}>
              <p className={styles.description}>
                Convert your Firepot HOTT tokens to rHOTT and stake them to earn exclusive protocol rewards. Converting your rHOTT back to HOTT might
                incur in a penalty.
              </p>
            </div>
          </div>
          <div className={styles.cardGreyContainer}>
            <div className={styles.boxList}>
              <span className={styles.title}>Available Boosts</span>
              <ul>
                <li>AMB holder (20%)</li>
                <li>Presale buyer (30%)</li>
                <li>Whitelist (10%)</li>
              </ul>
            </div>
            <div className={styles.boxList}>
              <span className={styles.title}>Penalties at withdrawal</span>
              <ul>
                <li>On withdrawal, a penalty will go from 50% to 0% linearly between 1 week and 6 months.</li>
              </ul>
            </div>
          </div>
          <div className={styles.despositInfoContainer}>
            <div className={styles.rightBox}>
              <span className={styles.title}>Total Deposit</span>
              <div className={styles.value}>
                <span className={styles.currencyIcon}>$</span>
                <span className={styles.price}>0.00</span>
                <span className={styles.currency}>USD</span>
              </div>
            </div>
            <img src='/assets/coin.svg' loading='lazy' alt='' className={styles.leftBox} />
          </div>
          {/* <DepositWithdrawInput></DepositWithdrawInput>*/}
          <div className={styles.connectWalletContainer}>
            <span className={styles.title}>Deposit</span>
            <button>Buy HOTT</button>
          </div>
        </section>
        <footer className={styles.footerBox}>
          <Button label='Deposit' buttonType='primary' onClick={action} disabled={true} icon=''></Button>
        </footer>
      </main>
    </>
  );
}

export default YieldVaultDeposit;
