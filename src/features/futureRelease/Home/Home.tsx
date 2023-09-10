import { useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Welcome from '../../../pages/welcome';
function Home() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
      navigate('/home/dashboard');
    }, 2000);
  }, []);

  return (
    <>
      {showWelcome && <Welcome />}
      <Outlet />
    </>
  );
}

export default Home;
