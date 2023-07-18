import style from './bottombar.module.scss';
import { ReactComponent as Icon } from '../../../assets/menu-icon.svg';
import { useNavigate } from 'react-router-dom';
import { BsChevronRight } from 'react-icons/bs';

export default function BottomBarBalance() {
  const navigate = useNavigate();

  return (
    <aside className={style.bar} onClick={() => navigate('/onboarding/chat')}>
      <button className={style.container}>
        <Icon />
      </button>
      <div className={style.box}>
        <div>Total Balance</div>
        <div>
          $0.00 <BsChevronRight className={style.nav} color='var(--primary)' size='24' />
        </div>
      </div>
    </aside>
  );
}
