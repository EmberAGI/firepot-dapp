import { useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Welcome from '../../pages/welcome';
function Onboarding() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
      navigate('/onboarding/start');
    }, 2000);
  }, []);

  return (
    <>
      {showWelcome && <Welcome />}
      <Outlet />
    </>
  );
}

export default Onboarding;
