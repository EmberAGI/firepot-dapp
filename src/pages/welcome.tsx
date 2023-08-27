import style from './styles/welcome.module.scss';
import { ReactComponent as FirepotLogo } from '../assets/firepot-logo.svg';
import background from '../assets/Loading.svg';

function Welcome() {
  return (
    <main className={style.welcome} style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
      <FirepotLogo />
    </main>
  );
}

export default Welcome;
