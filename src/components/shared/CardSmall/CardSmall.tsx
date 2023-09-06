import { BsShieldFillCheck } from 'react-icons/bs';
import { ReactComponent as Logo } from '../../../assets/vault-icon.svg';
import styles from './card.module.scss';

export default function CardSmall({
  text,
  subtext,
  onClick,
  // @ts-ignore
  icon,
  APY,
}: {
  text: string;
  onClick: any;
  icon?: string;
  subtext?: string;
  APY?: number;
}) {
  return (
    <div onClick={onClick} className={`${styles.card} ${styles.glass}`}>
      <div className={styles.flex}>
        <Logo width={48} height={48} />
        <div className={styles.top}>
          <h4>{text}</h4>
          <p> {subtext}</p>
        </div>
      </div>

      <div className={`${styles.pill}`}>
        <i>
          <BsShieldFillCheck color='#00D395' size='18px'></BsShieldFillCheck>
        </i>

        <span>{APY}% APY</span>
      </div>
    </div>
  );
}
