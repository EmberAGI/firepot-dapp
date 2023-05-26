import { useNetwork } from 'wagmi';
import { useBeefyVaultDeposit, useBeefyVaultWithdraw } from './hooks';
import { ConnectWallet } from '../../ConnectWallet';
import React, { useMemo, useState } from 'react';
import { safeAmountChange } from './helpers';

export function BeefyVaultDepositButton({ amount, contractAddress }: { amount: bigint; contractAddress: `0x${string}` }) {
  const { chain } = useNetwork();
  const { write } = useBeefyVaultDeposit(amount, { contractAddress, chainId: chain?.id! });
  return <button onClick={() => write?.()}>Deposit</button>;
}

export function BeefyVaultWithdrawButton({ amount, contractAddress }: { amount: bigint; contractAddress: `0x${string}` }) {
  const { chain } = useNetwork();
  const { write } = useBeefyVaultWithdraw(amount, { contractAddress, chainId: chain?.id! });
  return <button onClick={() => write?.()}>Withdraw</button>;
}

export function BeefyVault({ vaultAddress, vaultDecimals }: { vaultAddress: `0x${string}`; vaultDecimals: number }) {
  const { chain } = useNetwork();
  const [formVal, setFormVal] = useState('');
  if (!chain) return <ConnectWallet />;

  const amount: bigint = useMemo(() => {
    let spl = formVal.split('.');
    let spl1 = '';
    if (spl.length > 1) {
      spl1 = `${spl[1]}${'0'.repeat(vaultDecimals - spl[1].length)}`;
    } else {
      spl1 = '0'.repeat(vaultDecimals);
    }
    return BigInt(spl[0].concat(spl1));
  }, [formVal]);

  return (
    <React.Fragment>
      <label>
        Amount:{' '}
        <input
          name='Deposit/Withdraw Amount'
          placeholder='0.00'
          value={formVal}
          type='text'
          onChange={(e) => setFormVal(safeAmountChange(e.target.value, formVal, vaultDecimals))}
        />
      </label>
      {!!chain ? (
        <>
          <BeefyVaultDepositButton amount={amount} contractAddress={vaultAddress} />
          <BeefyVaultWithdrawButton amount={amount} contractAddress={vaultAddress} />
        </>
      ) : (
        <ConnectWallet />
      )}
    </React.Fragment>
  );
}
