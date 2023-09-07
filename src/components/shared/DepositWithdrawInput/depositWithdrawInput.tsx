import { useEffect, useState } from 'react';
import styles from './depositWithdrawInput.module.scss';

type MoveAction = 'deposit' | 'withdraw';

interface DepositWithdrawInputProps {
  moveAction: MoveAction;
  tokenName: string;
  stableSymbol: string;
  availableStableBalance: string;
  moveStableAmount: (amount: string) => void;
  tokenSymbol: string;
  availableTokenBalance: string;
  moveTokenAmount: string;
  moveTokenPercentage: number;
}

/**
 *
 * @description: This component is used to create a deposit and withdraw input
 * @returns
 */
export default function DepositWithdrawInput(props: DepositWithdrawInputProps) {
  const [moveAmount, setMoveAmount] = useState<string>('');

  const onInputChange = (value: string) => {
    if (Number(value) == 0) {
      setMoveAmount('');
    } else if (Number(value) > Number(props.availableStableBalance)) {
      setMoveAmount(props.availableStableBalance);
    } else {
      setMoveAmount(value);
    }
  };

  useEffect(() => {
    props.moveStableAmount(moveAmount);
  }, [moveAmount]);

  return (
    <div className={styles.despositContainer}>
      <span className={styles.title}>{props.moveAction == 'deposit' ? 'Deposit' : 'Withdraw'}</span>
      <div className={styles.cardWhiteDepositContainer}>
        <div className={styles.currencyBoxContainer}>
          <img src='/assets/firepot-blue-logo.svg' loading='lazy' alt='' />
          <div className={styles.inputDeposit}>
            <button onClick={() => setMoveAmount(props.availableStableBalance)}>Max</button>
            <input value={moveAmount} onChange={(event) => onInputChange(event.target.value)} type='number'></input>
            <span>{props.stableSymbol}</span>
          </div>
        </div>
        <div className={styles.titleProgressBox}>
          <span className={styles.titleCurrency}>{props.tokenName}</span>
          <span className={styles.valueCurrency}>
            <b>{props.moveTokenAmount}</b> / {props.availableTokenBalance} {props.tokenSymbol}
          </span>
        </div>
        <div className={styles.progressBox}>
          <progress value={props.moveTokenPercentage} max='100'></progress>
        </div>
      </div>
    </div>
  );
}
