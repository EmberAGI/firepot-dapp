import style from './styles/welcome.module.scss';
import { ReactComponent as FirepotLogo } from '../../public/assets/firepot-logo.svg';
import background from '../../public/assets/Loading.svg';

function Welcome() {
  return (
    <main className={style.welcome} style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
      <FirepotLogo />
    </main>
  );
}

export default Welcome;
