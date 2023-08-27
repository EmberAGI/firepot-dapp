import style from './dashboard.module.scss';
import BottomBar from '../../../components/shared/BottomBarMini/BottomBar';
import VaultOpportunityCard from '../../../components/shared/VaultOpportunityCard/VaultOpportunityCard';

import 'keen-slider/keen-slider.min.css';

import CardAsset from '../../../components/shared/CardAsset/CardAsset';

import Button from '../../../components/shared/Button/Button';
import VaultPositionCard from '../../../components/shared/VaultPositionCard/VaultPositionCard';
import useDashboardViewModel from './useDashboardViewModel';
import { ConnectWalletButton } from '../../../components/shared/ConnectWalletButton/ConnectWalletButton';

function PortfolioDashboard() {
  const { properties, commands } = useDashboardViewModel();

  const renderDiscovery = () => {
    return properties.showDiscovery ? (
      <section className={style.discover}>
        <div className={style.header}>
          <h3>
            <span>Discover</span>
          </h3>
        </div>
        <div className={style.container}>
          {properties.vaultOpportunities.map((opportunity) => {
            return (
              <VaultOpportunityCard
                id={opportunity.id}
                text={opportunity.text}
                onClick={() => commands.openVaultOpportunity(opportunity.id)}
                icon={opportunity.icon}
                subtext={opportunity.subtext}
                APY={opportunity.APY}
              ></VaultOpportunityCard>
            );
          })}
        </div>
      </section>
    ) : null;
  };

  const renderPositions = () => {
    return properties.showPositions ? (
      <section className={style.position}>
        <div className={style.header}>
          <h3>
            <span>Positions</span>
          </h3>
        </div>
        {properties.vaultPositions.map((position) => {
          return (
            <VaultPositionCard
              id={position.id}
              usd={position.usd}
              hott={position.hott}
              APY={position.APY}
              change={position.change}
              onClick={() => commands.openVaultPosition(position.id)}
            />
          );
        })}
      </section>
    ) : null;
  };

  const renderAssetElement = () => {
    switch (properties.assetElement) {
      case 'assets': {
        return properties.assets.map((asset) => (
          <CardAsset
            token={asset.token}
            onClick={asset.onClick}
            icon={asset.icon}
            name={asset.name}
            chain={asset.chain}
            amount={asset.amount}
            usd={asset.usd}
          />
        ));
      }
      case 'buy_token': {
        return <Button text={'Buy HOTT'} onClick={commands.buyToken} disabled={false} buttonType={'secondary'} />;
      }
      case 'connect_wallet': {
        return <ConnectWalletButton />;
      }
    }
  };

  return (
    <>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <main className={style.dashboardStart} style={{ height: '100%', overflow: 'hidden' }}>
          <section className={style.top}>
            <h4>Total Balance {properties.showWalletAddress && ` • ${properties.truncatedWalletAddress}`} </h4>
            <h1>
              $0.00 <small>USD</small>
            </h1>
          </section>
          {!properties.showLoading ? (
            <>
              {renderDiscovery()}
              {renderPositions()}
            </>
          ) : (
            // TODO: loading element
            <div>loading...</div>
          )}

          <section className={style.assets}>
            <div className={style.header}>
              <h3>
                <span>Assets</span>
              </h3>
            </div>
            {!properties.showLoading ? (
              renderAssetElement()
            ) : (
              // TODO: loading element
              <div>loading...</div>
            )}
          </section>
        </main>

        <BottomBar transparent={true} />
      </div>{' '}
    </>
  );
}

export default PortfolioDashboard;
