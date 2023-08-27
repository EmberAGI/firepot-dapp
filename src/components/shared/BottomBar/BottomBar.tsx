import style from './bottombar.module.scss';
import { ReactComponent as Icon } from '../../../assets/ember-icon.svg';
import { BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export default function BottomBar() {
  const navigate = useNavigate();

  return (
    <aside className={style.bar} onClick={() => navigate('/onboarding/chat')}>
      <button className={style.container}>
        <Icon />
      </button>
      <div className={style.box}>
        <div>Hi, I’m Ember. Click me to create a new wallet and get started.</div>
        <BsChevronRight className={style.nav} color='var(--primary)' size='36' />
      </div>
    </aside>
  );
}
