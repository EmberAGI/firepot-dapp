import { BsShieldFillCheck } from 'react-icons/bs';
import { ReactComponent as Logo } from '../../../assets/vault-icon.svg';
import styles from './card.module.scss';

export default function CardPosition({
  usd,
  btc,
  onClick,
  icon,
  APY,
  change,
}: {
  usd: number;
  onClick: any;
  icon?: string;
  btc?: number;
  APY?: number;
  change?: number;
}) {
  return (
    <div onClick={onClick} className={`${styles.card} ${styles.glass}`}>
      <div className={styles.flex}>
        <Logo width={48} height={48} />
        <div className={styles.top}>
          <h4>${usd}</h4>
          <p> {btc} BTC</p>
        </div>
      </div>

      <div className={`${styles.pill}`}>
        <div>
          <i>
            <BsShieldFillCheck color='#00D395' size='18px'></BsShieldFillCheck>
          </i>

          <span>{APY}%</span>
        </div>

        <span className={styles.highlight}>{change}%</span>
      </div>
    </div>
  );
}
