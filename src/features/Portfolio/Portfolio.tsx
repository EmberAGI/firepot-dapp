import { useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Welcome from '../../pages/welcome';
function Portfolio() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
      navigate('/portfolio');
    }, 1000);
  }, []);

  return (
    <>
      {showWelcome && <Welcome />}
      <Outlet />
    </>
  );
}

export default Portfolio;
