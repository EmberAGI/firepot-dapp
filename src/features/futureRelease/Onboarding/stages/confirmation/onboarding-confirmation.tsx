import { useEffect } from 'react';
import style from './onboarding-confirmation.module.scss';

import { useNavigate } from 'react-router-dom';

function OnboardingConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/onboarding/welcome');
    }, 3000);
  }, []);

  return (
    <main className={style.confirmation}>
      <h2>Your new wallet is being created...</h2>
    </main>
  );
}

export default OnboardingConfirmation;
