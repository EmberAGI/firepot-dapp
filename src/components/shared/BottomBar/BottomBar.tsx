import style from './bottombar.module.scss';
import { ReactComponent as Icon } from '../../../assets/ember-icon.svg';

export default function BottomBar() {
  return (
    <aside className={style.bar}>
      <button className={style.container}>
        <Icon />
      </button>
    </aside>
  );
}
