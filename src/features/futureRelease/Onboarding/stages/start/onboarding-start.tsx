import style from './onboarding-start.module.scss';
import { ReactComponent as OnboardingImage } from '../../../../assets/onboarding.svg';
import { useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/shared/Button/Button';
import BottomBar from '../../../../../components/shared/BottomBar/BottomBar';

function OnboardingStart() {
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  function handleNext() {
    navigate('/onboarding/confirmation');
  }

  return (
    <>
      <main className={style.onboardingStart}>
        <BsChevronLeft onClick={() => navigate(-1)} className={style.nav} color='var(--primary)' size='32' />
        <OnboardingImage />
        <h1>Let's get started</h1>
        <p>Sign up and recover your wallet by entering either your email or your phone number below.</p>
        <section>
          <div>
            <button onClick={() => setTab('email')} className={tab === 'email' ? style.active : ''}>
              Email
            </button>
            <button onClick={() => setTab('phone')} className={tab === 'phone' ? style.active : ''}>
              Phone
            </button>
          </div>
          {tab === 'email' ? (
            <input type='email' name='email' id='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          ) : (
            <input type='tel' name='phone' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
          )}
        </section>
        <div>
          <p>By connecting your wallet, you accept our Terms of Use and Privacy Policy</p>
          <Button text='Continue' onClick={handleNext} disabled={false} buttonType='primary' />
        </div>
      </main>
      <BottomBar />
    </>
  );
}

export default OnboardingStart;
