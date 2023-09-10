import style from './dashboard.module.scss';
import BottomBar from '../../../../components/shared/BottomBarNavigation/BottomBar';
import { MdChevronRight } from 'react-icons/md';
import VaultOpportunityCard from '../../../../components/shared/VaultOpportunityCard/VaultOpportunityCard';
import { useState } from 'react';
import CardSmall from '../../../../components/shared/CardSmall/CardSmall';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io';
import CardPosition from '../../../../components/shared/CardPosition/CardPosition';
import CardAsset from '../../../../components/shared/CardAsset/CardAsset';
import Bubble from '../../../../components/shared/NavBubble/Bubble';

function HomeDashboard() {
  const [assets, setAssets]: [boolean, any] = useState(true);
  const [discover, setDiscover]: [boolean, any] = useState(true);
  const [positions, setPositions]: [boolean, any] = useState(true);
  // @ts-ignore
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slides: {
        perView: 2.5,
        spacing: 10,
        origin: 0.04,
      },
      slideChanged() {
        console.log('slide changed');
      },
    },
    [
      // add plugins here
    ],
  );

  const toggleDiscover = () => {
    setDiscover(!discover);
    return undefined;
  };

  const togglePositions = () => {
    setPositions(!positions);
    return undefined;
  };

  const toggleAssets = () => {
    setAssets(!assets);
    return undefined;
  };

  return (
    <>
      <div style={!assets ? { height: '100%', overflow: 'hidden' } : {}}>
        <main className={style.dashboardStart} style={!assets ? { height: '100%', overflow: 'hidden' } : {}}>
          <section className={style.top}>
            <h4 onClick={toggleAssets}>Total Balance</h4>
            <h1>
              $0.00 <small>USD</small>
            </h1>
          </section>
          <section className={style.discover}>
            <div className={style.header}>
              <h3>
                <span>Discover</span>
                <MdChevronRight size='1em'></MdChevronRight>
              </h3>
              {assets && (
                <i onClick={toggleDiscover}>
                  {discover ? (
                    <IoIosArrowDropupCircle size='2em'></IoIosArrowDropupCircle>
                  ) : (
                    <IoIosArrowDropdownCircle size='2em'></IoIosArrowDropdownCircle>
                  )}
                </i>
              )}
            </div>
            {discover && (
              <>
                {assets === false ? (
                  <div className={style.container}>
                    <VaultOpportunityCard
                      text={'ETH'}
                      onClick={undefined}
                      icon={'eth'}
                      subtext='Compound • Farm'
                      APY={5.44}
                      id={''}
                    ></VaultOpportunityCard>
                    <VaultOpportunityCard
                      text={'ETH'}
                      onClick={undefined}
                      icon={'eth'}
                      subtext='Compound • Farm'
                      APY={5.44}
                      id={''}
                    ></VaultOpportunityCard>
                    <VaultOpportunityCard
                      text={'ETH'}
                      onClick={undefined}
                      icon={'eth'}
                      subtext='Compound • Farm'
                      APY={5.44}
                      id={''}
                    ></VaultOpportunityCard>
                    <VaultOpportunityCard
                      text={'ETH'}
                      onClick={undefined}
                      icon={'eth'}
                      subtext='Compound • Farm'
                      APY={5.44}
                      id={''}
                    ></VaultOpportunityCard>
                  </div>
                ) : (
                  <div ref={sliderRef} className='keen-slider'>
                    <div className='keen-slider__slide'>
                      <CardSmall text={'ETH'} onClick={undefined} icon={'eth'} subtext='Farm' APY={5.44}></CardSmall>
                    </div>
                    <div className='keen-slider__slide'>
                      <CardSmall text={'ETH'} onClick={undefined} icon={'eth'} subtext='Farm' APY={5.44}></CardSmall>
                    </div>
                    <div className='keen-slider__slide'>
                      <CardSmall text={'ETH'} onClick={undefined} icon={'eth'} subtext='Farm' APY={5.44}></CardSmall>
                    </div>
                    <div className='keen-slider__slide'>
                      <CardSmall text={'ETH'} onClick={undefined} icon={'eth'} subtext='Farm' APY={5.44}></CardSmall>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
          {assets && (
            <>
              {' '}
              <section className={style.positions}>
                <div className={style.header}>
                  <h3>
                    <span>Positions</span>
                    <MdChevronRight size='1em'></MdChevronRight>
                  </h3>
                  <i onClick={togglePositions}>
                    {' '}
                    {positions ? (
                      <IoIosArrowDropupCircle size='2em'></IoIosArrowDropupCircle>
                    ) : (
                      <IoIosArrowDropdownCircle size='2em'></IoIosArrowDropdownCircle>
                    )}
                  </i>
                </div>

                {positions && (
                  <div className={style.container}>
                    <CardPosition usd={652.25} onClick={undefined} icon={'eth'} btc={0.024} APY={5.44} change={1.17}></CardPosition>
                    <CardPosition usd={652.25} onClick={undefined} icon={'eth'} btc={0.024} APY={5.44} change={1.17}></CardPosition>
                    <CardPosition usd={652.25} onClick={undefined} icon={'eth'} btc={0.024} APY={5.44} change={1.17}></CardPosition>
                  </div>
                )}
              </section>{' '}
            </>
          )}
          {assets ? (
            <>
              <section className={style.assets}>
                <div className={style.header}>
                  <h3>
                    <span>Assets</span>
                    <MdChevronRight size='1em'></MdChevronRight>
                  </h3>
                </div>

                <CardAsset
                  token={'HOTT'}
                  onClick={undefined}
                  icon={'eth'}
                  name='Firepot Finance'
                  chain='polygon'
                  amount={32}
                  usd={428.39}
                ></CardAsset>
              </section>
            </>
          ) : (
            <p className={style.notification}>You have no assets</p>
          )}{' '}
        </main>
        <Bubble />
        <BottomBar transparent={assets ? true : false} />
      </div>{' '}
    </>
  );
}

export default HomeDashboard;
