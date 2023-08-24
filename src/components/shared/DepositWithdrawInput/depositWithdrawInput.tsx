
import styles from './depositWithdrawInput.module.scss';

/**
 * 
 * @description: This component is used to create a deposit and withdraw input  
 * @returns 
 */
export default function DepositWithdrawInput() {
    return (
        <div className={styles.despositContainer}>
            <span className={styles.title}>Deposit</span>
            <div className={styles.cardWhiteDepositContainer}>
                <div className={styles.currencyBoxContainer}>
                    <img
                        src='src/assets/firepot-blue-logo.svg'
                        loading='lazy'
                        alt=''
                    />
                    <div className={styles.inputDeposit}>
                        <button>Max</button>
                        <input type='number'></input>
                        <span>USD</span>
                    </div>
                </div>
                <div className={styles.titleProgressBox}>
                    <span className={styles.titleCurrency}>Firepot</span>
                    <span className={styles.valueCurrency}><b>32.00</b> / 32.00 HOTT</span>
                </div>
                <div className={styles.progressBox}>
                    <progress value="80" max="100" ></progress>
                </div>
            </div>
        </div>
    );
}
