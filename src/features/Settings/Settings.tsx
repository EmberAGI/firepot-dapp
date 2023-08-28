import { useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Welcome from '../../pages/welcome';
function Settings() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
      navigate('/settings/wallet');
    }, 2000);
  }, []);

  return (
    <>
      {showWelcome && <Welcome />}
      <Outlet />
    </>
  );
}

export default Settings;
