import styles from './button-bar.module.scss';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

export default function ButtonBar() {
  const navigate = useNavigate();
  return (
    <div className={styles.buttonBar}>
      <Button text={'View Portfolio'} onClick={() => navigate('/portfolio')} disabled={false} buttonType={'secondary'}></Button>
      <Button text={'Deposit into vault'} onClick={() => navigate('/yield-vault-deposit')} disabled={false} buttonType={'primary'}></Button>
    </div>
  );
}
