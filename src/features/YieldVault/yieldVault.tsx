import HeaderBackButton from "../../components/shared/HeaderBackButton/headerBackButton";
import DepositWithdrawInput from '../../components/shared/DepositWithdrawInput/depositWithdrawInput';
import styles from './yieldVault.module.scss'

function YieldVault() {
    return (
        <>
            <main className={styles.mainBox}>
                <HeaderBackButton title='Yield Vault' url='/yield-vault' />
                <section className={styles.sectionBox}>
                    <div className={styles.titleContainer}>
                        <span>
                            Firepot
                        </span>
                        <div className={styles.currencyBox}>
                            <img
                                src='src/assets/verify.svg'
                                loading='lazy'
                                alt=''
                            />
                            <span className={styles.percentage}>20.44%</span>
                            <span className={styles.currency}>APY</span>
                        </div>
                    </div>
                    <div className={styles.secondSection}>
                        <img
                            src='src/assets/firepot-blue-logo.svg'
                            loading='lazy'
                            alt=''
                        />
                        <div className={styles.currencySection}>
                            <div className={styles.firstSection}>
                                <span className={styles.symbol}>$</span>
                                <span className={styles.value}>432.54</span>
                                <span className={styles.currency}>USD</span>
                            </div>
                            <div className={styles.interestSection}>
                                <span>32.24 HOTT</span>
                                <div className={styles.percentage}>
                                    <span>+0.24 (1.17%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.thirdSection}>
                        <span className={styles.title}>Personal Metrics</span>
                        <div className={styles.subtitleSection}>
                            <span className={styles.subtitle}>Current Reward Multipler</span>
                            <span className={styles.pot}>1.3x</span>
                        </div>
                    </div>
                </section>
                <section className={styles.costBox}>
                    <div className={styles.titleContainer}>
                        <span className={styles.title}>Cost Basics</span>
                        <span className={styles.value}>$428.39 USD</span>
                    </div>
                    <div className={styles.switchContainer}>
                        <div className={styles.wrapper}>
                            <div className={styles.option}>
                                <input className={styles.input} type="radio" name="btn" value="option1" />
                                <div className={styles.btn}>
                                    <span className={styles.span}>Deposit</span>
                                </div>
                            </div>
                            <div className={styles.option}>
                                <input className={styles.input} type="radio" name="btn" value="option2" />
                                <div className={styles.btn}>
                                    <span className={styles.span}>Withdraw</span>
                                </div>  </div>
                        </div>
                    </div>
                    <DepositWithdrawInput></DepositWithdrawInput>
                </section>
                <section className={styles.resume}>
                    <div className={styles.container}>
                        <span className={styles.title}>Fees</span>
                        <div className={styles.valuesContainer}>
                            <div className={styles.currencyContainer}>
                                <span className={styles.symbol} >$</span>
                                <span className={styles.value}>1.00</span>
                                <span className={styles.currency}>USD</span>
                            </div>
                            <span className={styles.subtitle}>0.36 HOTT</span>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <span className={styles.title}>Penalty</span>
                        <div className={styles.valuesContainer}>
                            <div className={styles.currencyContainer}>
                                <span className={styles.symbol} >$</span>
                                <span className={styles.value}>214.14</span>
                                <span className={styles.currency}>USD</span>
                            </div>
                            <span className={styles.subtitle}>16.12 HOTT</span>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <span className={styles.title}>Total to be Received</span>
                        <div className={styles.valuesContainer}>
                            <div className={styles.currencyContainer}>
                                <span className={styles.symbol} >$</span>
                                <span className={styles.value}>213.15</span>
                                <span className={styles.currency}>USD</span>
                            </div>
                            <span className={styles.subtitle}>23.69 HOTT</span>
                        </div>
                    </div>
                </section>
                <footer className={styles.footerBox}>
                    <button>Deposit</button>
                </footer>
            </main>
        </>
    );
}

export default YieldVault;
