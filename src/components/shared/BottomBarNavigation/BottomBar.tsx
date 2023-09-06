import style from './bottomBar.module.scss';
import { ReactComponent as Icon } from '../../../assets/ember-icon.svg';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdDiversity3, MdSettings } from 'react-icons/md';
import { TbWorldSearch } from 'react-icons/tb';

export default function BottomBar({ transparent }: { transparent?: boolean }) {
  const navigate = useNavigate();

  return (
    <aside className={`${style.bar} ${transparent && style.glass}`} onClick={() => navigate('/onboarding/chat')}>
      <button className={`${style.small} ${style.highlight}`}>
        <div className={`${style.button}`}>
          <MdDashboard color={'var(--primary)'} size='22px'></MdDashboard>
        </div>
        <p>Portfolio</p>
      </button>
      <button className={`${style.small}`}>
        <div className={`${style.button}`}>
          <TbWorldSearch color={'var(--primary)'} size='22px'></TbWorldSearch>
        </div>
        <p>Discover</p>
      </button>
      <button className={`${style.container} ${style.large}`}>
        <Icon />
      </button>
      <button className={`${style.small}`}>
        <div className={`${style.button}`}>
          <MdDiversity3 color={'var(--primary)'} size='22px'></MdDiversity3>
        </div>
        <p>Social</p>
      </button>
      <button className={`${style.small}`}>
        <div className={`${style.button}`}>
          <MdSettings color={'var(--primary)'} size='22px'></MdSettings>
        </div>
        <p>Settings</p>
      </button>
    </aside>
  );
}
