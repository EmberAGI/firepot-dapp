import { ReactComponent as Logo } from '../../../assets/hott.svg';
import styles from './card.module.scss';
import { IoMdInfinite } from 'react-icons/io';

export default function CardAsset({
  usd,
  token,
  amount,
  onClick,
  // @ts-ignore
  icon, 
  name,
  chain,
}: {
  usd: number;
  onClick: any;
  icon?: string;
  token?: string;
  amount?: number;
  APY?: number;
  change?: number;
  name?: string;
  chain?: string;
}) {
  return (
    <div onClick={onClick} className={`${styles.card} ${styles.glass}`}>
      <div className={styles.flex}>
        <div className={styles.left}>
          <Logo width={48} height={48} />
          <div className={styles.column}>
            <h3>{name}</h3>
            <h5 className={styles.pill}>
              <i>
                <IoMdInfinite></IoMdInfinite>
              </i>
              <p>{chain?.toUpperCase()}</p>
            </h5>
          </div>
        </div>

        <div className={styles.top}>
          <h4>${usd}</h4>
          <p>
            {' '}
            {amount} {token}
          </p>
        </div>
      </div>
    </div>
  );
}
