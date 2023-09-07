import { BsShieldFillCheck } from 'react-icons/bs';
import { ReactComponent as Logo } from '../../../../public/assets/hott.svg';
import styles from './vaultPositionCard.module.scss';

export interface VaultPositionCardProps {
  id: string;
  usd: number;
  hott: number;
  onClick: any;
  icon?: string;
  APY?: number;
  change?: number;
}

export default function VaultPositionCard({ usd, hott, onClick, APY }: VaultPositionCardProps) {
  return (
    <div onClick={onClick} className={`${styles.card} ${styles.glass}`}>
      <div className={styles.flex}>
        <Logo width={48} height={48} />
        <div className={styles.top}>
          <h4>${usd}</h4>
          <p> {hott} HOTT</p>
        </div>
      </div>

      <div className={`${styles.pill}`}>
        <div>
          <i>
            <BsShieldFillCheck color='#00D395' size='18px'></BsShieldFillCheck>
          </i>

          <span>{APY}%</span>
        </div>

        {/*<span className={styles.highlight}>{change}%</span>*/}
      </div>
    </div>
  );
}
