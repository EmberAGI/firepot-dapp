import style from './onboarding.module.scss';
import { ReactComponent as OnboardingImage } from '../../assets/onboarding.svg';
import { useState } from 'react';
import Button from '../../components/shared/Button/Button';
import { BsChevronLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
function Onboarding() {
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  return (
    <main className={style.onboarding}>
      <BsChevronLeft onClick={() => navigate(-1)} className={style.nav} color='var(--primary)' size='32' />
      <OnboardingImage />
      <h1>Let's get started</h1>
      <p>Sign up and recover your wallet by entering either your email or your phone number below.</p>
      <section>
        <div>
          <button onClick={() => setTab('email')}>Email</button>
          <button onClick={() => setTab('phone')}>Phone</button>
        </div>
        {tab === 'email' ? (
          <input type='email' name='email' id='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          <input type='tel' name='phone' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
        )}
      </section>
      <div>
        <p>By connecting your wallet, you accept our Terms of Use and Privacy Policy</p>
        <Button text='Continue' onClick={() => console.log('next')} disabled={false} buttonType='primary' />
      </div>
    </main>
  );
}

export default Onboarding;
