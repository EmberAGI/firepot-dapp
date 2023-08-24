import style from './dashboard.module.scss';
import BottomBar from '../../../components/shared/BottomBarMini/BottomBar';
import { MdChevronRight } from 'react-icons/md';
import Card from '../../../components/shared/Card/Card';
import { useState } from 'react';

import 'keen-slider/keen-slider.min.css';

import CardAsset from '../../../components/shared/CardAsset/CardAsset';

import Button from '../../../components/shared/Button/Button';
import CardPosition from '../../../components/shared/CardPositionSummary/CardPosition';

function PortfolioDashboard() {
  const [assets, setAssets]: [boolean, any] = useState(false);
  const [walletAddress, setWalletAddress]: [string, any] = useState('');
  const [position, setPosition]: [number, any] = useState(-1);

  const toggleAssets = () => {
    setAssets(!assets);
    return undefined;
  };

  const toggleWalletAddress = () => {
    setWalletAddress('0x1...890');
    return undefined;
  };

  const togglePosition = () => {
    setPosition(1);
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
          {position > 0 ? (
            <section className={style.position}>
              <div className={style.header}>
                <h3>
                  <span>Positions</span>
                  <MdChevronRight size='1em'></MdChevronRight>
                </h3>
              </div>
              <CardPosition usd={432.54} hott={32.24} APY={20.44} change={1.34} onClick={undefined} />
            </section>
          ) : (
            <>
              {' '}
              <section className={style.discover}>
                <div className={style.header}>
                  <h3>
                    <span>Discover</span>
                    <MdChevronRight size='1em'></MdChevronRight>
                  </h3>
                </div>
                <>
                  <div className={style.container}>
                    <Card text={'HOTT'} onClick={togglePosition} icon={'hott'} subtext='Firepot • Earn' APY={20.44}></Card>
                  </div>
                </>
              </section>
              <>
                <section className={style.assets}>
                  <div className={style.header}>
                    <h3>
                      <span>Assets</span>
                      <MdChevronRight size='1em'></MdChevronRight>
                    </h3>
                  </div>
                  {walletAddress ? (
                    assets ? (
                      <CardAsset
                        token={'HOTT'}
                        onClick={undefined}
                        icon={'eth'}
                        name='Firepot Finance'
                        chain='polygon'
                        amount={32}
                        usd={428.39}
                      ></CardAsset>
                    ) : (
                      <Button text={'Buy HOTT'} onClick={toggleAssets} disabled={false} buttonType={'secondary'} />
                    )
                  ) : (
                    <Button text={'Connect Wallet'} onClick={toggleWalletAddress} disabled={false} buttonType={'secondary'} />
                  )}
                </section>
              </>
            </>
          )}
        </main>

        <BottomBar transparent={true} />
      </div>{' '}
    </>
  );
}

export default PortfolioDashboard;
