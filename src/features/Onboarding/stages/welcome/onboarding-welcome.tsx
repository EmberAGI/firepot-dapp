import BottomBar from '../../../../components/shared/BottomBar/BottomBar';
import Button from '../../../../components/shared/Button/Button';
import style from './onboarding-welcome.module.scss';

import { useNavigate } from 'react-router-dom';
import { ReactComponent as EmberImage } from '../../../../assets/ember.svg';
import { useState } from 'react';
import Action from '../../../../components/shared/Action/action';

function OnboardingWelcome() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/onboarding/register');
  };

  const [username] = useState('Tom');

  return (
    <>
      <main className={style.welcome}>
        <div>
          <EmberImage />
          <h1>Great work {username}!</h1>
          <p>Next, let’s assess your risk tolerance and financial goals</p>
          <p>With this data, I can help recommend assets and strategies to optimize your portfolio.</p>
        </div>

        <div>
          <Action text='Next' onClick={handleNext} disabled={false} />
        </div>
      </main>
      <BottomBar />
    </>
  );
}

export default OnboardingWelcome;
