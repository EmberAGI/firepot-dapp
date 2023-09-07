import style from './bottomBar.module.scss';
import { ReactComponent as Icon } from '../../../assets/menu-icon.svg';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

export default function BottomBarButton(action: any) {
  const navigate = useNavigate();

  return (
    <aside className={style.bar} onClick={() => navigate('/onboarding/chat')}>
      <button className={style.container}>
        <Icon />
      </button>
      <div className={style.box}>
        <Button label='Register Passkey' buttonType='primary' onClick={action} disabled={false} icon='passkey'></Button>
      </div>
    </aside>
  );
}
