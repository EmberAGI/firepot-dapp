import style from './bottomBar.module.scss';

import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdSettings } from 'react-icons/md';

export default function BottomBar({ transparent }: { transparent?: boolean }) {
  const navigate = useNavigate();

  return (
    <aside className={`${style.bar} ${transparent && style.glass}`}>
      <button className={`${style.small} ${style.highlight}`} onClick={() => navigate('/')}>
        <div className={`${style.button}`}>
          <MdDashboard color={'var(--primary)'} size='22px'></MdDashboard>
        </div>
        <p>Portfolio</p>
      </button>

      <button className={`${style.small}`} onClick={() => navigate('/settings')}>
        <div className={`${style.button}`}>
          <MdSettings color={'var(--primary)'} size='22px'></MdSettings>
        </div>
        <p>Settings</p>
      </button>
    </aside>
  );
}
