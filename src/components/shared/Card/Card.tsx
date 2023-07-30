import { BsShieldFillCheck } from 'react-icons/bs';
import { ReactComponent as Logo } from '../../../assets/vault-icon.svg';
import styles from './card.module.scss';

export default function Card({ text, subtext, onClick, icon, APY }: { text: string; onClick: any; icon?: string; subtext?: string; APY?: number }) {
  return (
    <div onClick={onClick} className={`${styles.card} ${styles.glass}`}>
      <div className={styles.top}>
        <h4>{text}</h4>
        <p> {subtext}</p>
      </div>

      <Logo width={48} height={48} />
      <div className={`${styles.pill}`}>
        <i>
          <BsShieldFillCheck color='#00D395' size='18px'></BsShieldFillCheck>
        </i>

        <span>{APY}%</span>
      </div>
    </div>
  );
}
