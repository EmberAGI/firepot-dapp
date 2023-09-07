import style from './settings.module.scss';
import BottomBar from '../../../components/shared/BottomBarMini/BottomBar';
import { MdChevronRight } from 'react-icons/md';

import { useState } from 'react';

import Button from '../../../components/shared/Button/Button';

function SettingsWallet() {
  const [assets, setAssets]: [boolean, any] = useState(false);
  const [walletAddress, setWalletAddress]: [string, any] = useState('');

  const toggleAssets = () => {
    setAssets(!assets);
    return undefined;
  };

  const toggleWalletAddress = () => {
    setWalletAddress('0x1...890');
    return undefined;
  };

  return (
    <>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <main className={style.dashboardStart} style={{ height: '100%', overflow: 'hidden' }}>
          <section className={style.top}>
            <h4 onClick={toggleAssets}>Total Balance {walletAddress && ` • ${walletAddress}`} </h4>
            <h1 onClick={toggleWalletAddress}>
              $0.00 <small>USD</small>
            </h1>
          </section>

          <>
            <section className={style.assets}>
              <div className={style.header}>
                <h3>
                  <span>Settings</span>
                  <MdChevronRight size='1em'></MdChevronRight>
                </h3>
              </div>

              <Button label={'Disconnect Wallet'} onClick={toggleAssets} disabled={!walletAddress} buttonType={'secondary'} icon='settings' />
            </section>
          </>
        </main>

        <BottomBar transparent={true} />
      </div>{' '}
    </>
  );
}

export default SettingsWallet;
