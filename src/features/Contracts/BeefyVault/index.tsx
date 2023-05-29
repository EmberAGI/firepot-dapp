import { useNetwork } from 'wagmi';
import { useBeefyVaultDeposit, useBeefyVaultWithdraw, usePrettyBigInt } from './hooks';
import { ConnectWallet } from '../../ConnectWallet';
import React from 'react';
import { ChainData } from './reads';

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

export function BeefyVault({
  vaultAddress,
  tokenDecimals,
  chainData,
}: {
  vaultAddress: `0x${string}`;
  tokenDecimals: number;
  chainData: ChainData;
}) {
  const { chain } = useNetwork();
  const { amount: depositAmount, formVal: depositFormVal, setFormVal: setDepositFormVal } = usePrettyBigInt(tokenDecimals);
  const { amount: withdrawalAmount, formVal: withdrawalFormVal, setFormVal: setWithdrawalFormVal } = usePrettyBigInt(18); // beefy vaults are hardcoded 18 decimals

  if (!chain) return <ConnectWallet />;

  return (
    <React.Fragment>
      <label>
        Deposit Amount:{' '}
        <input name='Deposit Amount' placeholder='0.00' value={depositFormVal} type='text' onChange={(e) => setDepositFormVal(e.target.value)} />
        <div>
          <button onClick={() => setDepositFormVal(chainData.depositTokenBalance)}>Max</button>
        </div>
      </label>
      <BeefyVaultDepositButton amount={depositAmount} contractAddress={vaultAddress} />
      <label>
        Withdrawal Amount:{' '}
        <input
          name='Withdraw Amount'
          placeholder='0.00'
          value={withdrawalFormVal}
          type='text'
          onChange={(e) => setWithdrawalFormVal(e.target.value)}
        />
        <div>
          <button onClick={() => setWithdrawalFormVal(maxWithdrawal)}>Max</button>
        </div>
      </label>
      <BeefyVaultWithdrawButton amount={withdrawalAmount} contractAddress={vaultAddress} />
    </React.Fragment>
  );
}
