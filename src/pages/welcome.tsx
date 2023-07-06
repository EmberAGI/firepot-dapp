import style from './styles/welcome.module.scss';
import { ReactComponent as FirepotLogo } from '../assets/firepot-logo.svg';

function Welcome() {
  return (
    <main className={style.welcome}>
      <FirepotLogo />
    </main>
  );
}

export default Welcome;
