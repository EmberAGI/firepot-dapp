import style from './bottombar.module.scss';
import { ReactComponent as Icon } from '../../../assets/menu-icon.svg';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

export default function BottomBarButton() {
  const navigate = useNavigate();

  return (
    <aside className={style.bar} onClick={() => navigate('/onboarding/chat')}>
      <button className={style.container}>
        <Icon />
      </button>
      <div className={style.box}>
        <Button text='Register Passkey' buttonType='primary' onClick={() => {}} disabled={false}></Button>
      </div>
    </aside>
  );
}
