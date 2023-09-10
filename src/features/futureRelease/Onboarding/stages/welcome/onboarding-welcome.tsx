import BottomBar from '../../../../../components/shared/BottomBar/BottomBar';
import style from './onboarding-welcome.module.scss';
import { ReactComponent as WelcomeImage } from '../../../../assets/welcome.svg';

function OnboardingWelcome() {
  return (
    <>
      <main className={style.welcome}>
        <div>
          <h1>Welcome to Firepot</h1>
          <p>
            <b>Self-Custody. Real Yield. All Crypto.</b>
          </p>
          <WelcomeImage />
          <div className={style.flex}>
            <p>Already have a wallet?</p>
            <p>
              <span onClick={() => {}}> Sign In</span>
            </p>
          </div>
        </div>
      </main>
      <BottomBar />
    </>
  );
}

export default OnboardingWelcome;
