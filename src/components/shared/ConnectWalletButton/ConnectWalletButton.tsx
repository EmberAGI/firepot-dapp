import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from '../Button/Button';
export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return <Button text={'Connect Wallet'} onClick={openConnectModal} disabled={false} buttonType={'secondary'} />;
              }
              if (chain.unsupported) {
                return <Button text={'Wrong network'} onClick={openChainModal} disabled={false} buttonType={'secondary'} />;
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type='button'>
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} />}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type='button'>
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
