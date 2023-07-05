import styles from './styles/welcome.module.scss';
import { ReactComponent as FirepotLogo } from '../assets/firepot-logo.svg';

function Welcome() {
  console.log(styles);
  return (
    <main className={styles.welcome}>
      <FirepotLogo />
    </main>
  );
}

export default Welcome;
