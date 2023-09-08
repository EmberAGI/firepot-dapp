import HeaderBackButton from '../../components/shared/HeaderBackButton/headerBackButton';
import DepositWithdrawInput from '../../components/shared/DepositWithdrawInput/depositWithdrawInput';
import styles from './yieldVault.module.scss';
import useYieldVaultViewModel from './useYieldVaultViewModel';
import ButtonBar from '../../components/shared/ButtonBar/ButtonBar';

const YIELD_VAULT_ADDRESS = '0xe3dc90C119c46d77659CBbc5f470159A3385ad74';

function YieldVault() {
  const { properties, commands } = useYieldVaultViewModel(YIELD_VAULT_ADDRESS);

  return (
    <>
      <main className={styles.mainBox}>
        <HeaderBackButton title='Yield Vault' />
        <section className={styles.sectionBox}>
          <div className={styles.titleContainer}>
            <span>Firepot Finance</span>
            <div className={styles.currencyBox}>
              <img src='/assets/verify.svg' loading='lazy' alt='' />
              <span className={styles.percentage}>{properties.apy}%</span>
              <span className={styles.currency}>APR</span>
            </div>
          </div>
          <div className={styles.secondSection}>
            <img src='/assets/firepot-blue-logo.svg' loading='lazy' alt='' />
            <div className={styles.currencySection}>
              <div className={styles.firstSection}>
                <span className={styles.symbol}>$</span>
                <span className={styles.value}>{properties.vaultStableBalance}</span>
                <span className={styles.currency}>{properties.stableSymbol}</span>
              </div>
              <div className={styles.interestSection}>
                <span>
                  {properties.vaultTokenBalance} {properties.tokenSymbol}
                </span>
                {/*}
                <div className={styles.percentage}>
                  <span>
                    +{properties.vaultReturn.tokenReturn} ({properties.vaultReturn.returnPercentage}%)
                  </span>
                </div>
                */}
              </div>
            </div>
          </div>
          {/* TODO: Add this section when we have the data
          <div className={styles.thirdSection}>
            <span className={styles.title}>Personal Metrics</span>
            <div className={styles.subtitleSection}>
              <span className={styles.subtitle}>Current Reward Multipler</span>
              <span className={styles.pot}>1.3x</span>
            </div>
          </div>
          */}
        </section>
        <section className={styles.costBox}>
          {/* TODO: Add this section when we have the data
          <div className={styles.titleContainer}>
            <span className={styles.title}>Cost Basis</span>
            <span className={styles.value}>$428.39 USD</span>
          </div>
          */}
          {/*
          <div className={styles.switchContainer}>
            <div className={styles.wrapper}>
              <div className={styles.option}>
                <input
                  className={styles.input}
                  type='radio'
                  name='btn'
                  value='option1'
                  onChange={() => commands.switchVaultTab('deposit')}
                  checked={properties.vaultTab == 'deposit'}
                />
                <div className={styles.btn}>
                  <span className={styles.span}>Deposit</span>
                </div>
              </div>
              <div className={styles.option}>
                <input
                  className={styles.input}
                  type='radio'
                  name='btn'
                  value='option2'
                  onChange={() => commands.switchVaultTab('withdraw')}
                  checked={properties.vaultTab == 'withdraw'}
                />
                <div className={styles.btn}>
                  <span className={styles.span}>Withdraw</span>
                </div>{' '}
              </div>
            </div>
          </div>
          */}
          <DepositWithdrawInput
            moveAction={properties.vaultTab}
            tokenName='Firepot Finance'
            stableSymbol={properties.stableSymbol}
            availableStableBalance={properties.vaultTab == 'deposit' ? properties.availableStableBalance : properties.vaultStableBalance}
            moveStableAmount={(amount) => commands.updateMoveStableAmount(amount)}
            tokenSymbol={properties.tokenSymbol}
            availableTokenBalance={properties.vaultTab == 'deposit' ? properties.availableTokenBalance : properties.vaultTokenBalance}
            moveTokenAmount={properties.moveTokenAmount}
            moveTokenPercentage={properties.moveTokenPercentage}
          ></DepositWithdrawInput>
          <ButtonBar
            leftButton={{
              label: properties.approveLockButton.label,
              onClick: () => commands.approveLock(),
              disabled: !properties.approveLockButton.isEnabled,
              hide: !properties.approveLockButton.show,
              showActivityIndicator: properties.approveLockButton.showActivityIndicator,
            }}
            rightButton={{
              label: properties.lockButton.label,
              onClick: () => commands.lock(),
              disabled: !properties.lockButton.isEnabled,
              hide: !properties.lockButton.show,
              showActivityIndicator: properties.lockButton.showActivityIndicator,
            }}
          />
        </section>
        {properties.showTransactionPreview && properties.transactionPreview != null ? (
          <section className={styles.resume}>
            {/*
            <div className={styles.container}>
              <span className={styles.title}>Subtotal</span>
              <div className={styles.valuesContainer}>
                <div className={styles.currencyContainer}>
                  <span className={styles.symbol}>$</span>
                  <span className={styles.value}>{properties.transactionPreview!.subtotalStableAmount}</span>
                  <span className={styles.currency}>{properties.transactionPreview!.stableSymbol}</span>
                </div>
                <span className={styles.subtitle}>
                  {properties.transactionPreview!.subtotalTokenAmount} {properties.transactionPreview!.tokenSymbol}
                </span>
              </div>
            </div>
            <div className={styles.container}>
              <span className={styles.title}>Penalty</span>
              <div className={styles.valuesContainer}>
                <div className={styles.currencyContainer}>
                  <span className={styles.symbol}>$</span>
                  <span className={styles.value}>{properties.transactionPreview!.penaltyStableAmount}</span>
                  <span className={styles.currency}>{properties.transactionPreview!.stableSymbol}</span>
                </div>
                <span className={styles.subtitle}>
                  {properties.transactionPreview!.penaltyTokenAmount} {properties.transactionPreview!.tokenSymbol}
                </span>
              </div>
            </div>
            <div className={styles.container}>
              <span className={styles.title}>Fees</span>
              <div className={styles.valuesContainer}>
                <div className={styles.currencyContainer}>
                  <span className={styles.symbol}>$</span>
                  <span className={styles.value}>{properties.transactionPreview!.feesStableAmount}</span>
                  <span className={styles.currency}>{properties.transactionPreview!.stableSymbol}</span>
                </div>
                <span className={styles.subtitle}>
                  {properties.transactionPreview!.feesTokenAmount} {properties.transactionPreview!.tokenSymbol}
                </span>
              </div>
            </div>
            */}
            <div className={styles.container}>
              <span className={styles.title}>Total {properties.actionLabel}</span>
              <div className={styles.valuesContainer}>
                <div className={styles.currencyContainer}>
                  <span className={styles.symbol}>$</span>
                  <span className={styles.value}>{properties.transactionPreview!.totalStableAmount}</span>
                  <span className={styles.currency}>{properties.transactionPreview!.stableSymbol}</span>
                </div>
                <span className={styles.subtitle}>
                  {properties.transactionPreview!.totalTokenAmount} {properties.transactionPreview!.tokenSymbol}
                </span>
              </div>
            </div>
          </section>
        ) : null}
        <footer className={styles.footerBox}>
          <ButtonBar
            leftButton={{
              label: properties.approveDepositButton.label,
              onClick: () => commands.approveDeposit(),
              disabled: !properties.approveDepositButton.isEnabled,
              hide: !properties.approveDepositButton.show,
              showActivityIndicator: properties.approveDepositButton.showActivityIndicator,
            }}
            rightButton={{
              label: properties.depositButton.label,
              onClick: () => commands.deposit(),
              disabled: !properties.depositButton.isEnabled,
              hide: !properties.depositButton.show,
              showActivityIndicator: properties.depositButton.showActivityIndicator,
            }}
          />
        </footer>
      </main>
    </>
  );
}

export default YieldVault;
