import { useNetwork } from 'wagmi';
import { useBeefyVaultDeposit, useBeefyVaultWithdraw } from './hooks';
import { useTokenApprove, useTokenAllowance } from '../hooks';
import { ConnectWallet } from '../../ConnectWallet';
import React, { useState } from 'react';
import { TokenBalanceElem } from './reads';
import { useSafeBigIntForms } from '../../../lib/hooks/useSafeBigIntForms';

export function BeefyVaultDepositButton({
  allowed,
  amount,
  contractAddress,
  depositTokenAddress,
}: {
  allowed: boolean;
  amount: bigint;
  contractAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
}) {
  const { chain } = useNetwork(); // TODO: Maybe make requiredChainId this an argument later? if chainId matches required chainId, then we are good. Else, return change network button
  const { write: writeDeposit } = useBeefyVaultDeposit(amount, { contractAddress, chainId: chain?.id! });
  const { write: writeTokenApprove } = useTokenApprove({ spender: contractAddress, amount, tokenAddress: depositTokenAddress });
  return allowed ? <button onClick={() => writeDeposit?.()}>Deposit</button> : <button onClick={() => writeTokenApprove?.()}>Approve</button>;
}

export function BeefyVaultWithdrawButton({ allowed, amount, contractAddress }: { allowed: boolean; amount: bigint; contractAddress: `0x${string}` }) {
  const { chain } = useNetwork(); // TODO: Maybe make requiredChainId this an argument later? if chainId matches required chainId, then we are good. Else, return change network button
  const { write: writeWithdraw } = useBeefyVaultWithdraw(amount, { contractAddress, chainId: chain?.id! });
  const { write: writeTokenApprove } = useTokenApprove({ spender: contractAddress, amount, tokenAddress: contractAddress });
  return allowed ? <button onClick={() => writeWithdraw?.()}>Withdraw</button> : <button onClick={() => writeTokenApprove?.()}>Approve</button>;
}

export function BeefyVault({
  vaultAddress,
  depositTokenAddress,
  tokenDecimals,
  tokenBalances,
}: {
  vaultAddress: `0x${string}`;
  depositTokenAddress: `0x${string}`;
  tokenDecimals: number;
  tokenBalances: TokenBalanceElem;
}) {
  const { chain } = useNetwork();
  const { amount: depositAmount, formVal: depositFormVal, setFormVal: setDepositFormVal } = useSafeBigIntForms(tokenDecimals);
  const { amount: withdrawalAmount, formVal: withdrawalFormVal, setFormVal: setWithdrawalFormVal } = useSafeBigIntForms(18); // beefy vaults are hardcoded 18 decimals
  const [formTouched, setFormTouched] = useState(false);
  const allowances = useTokenAllowance({ enabled: formTouched, vaultAddress, depositTokenAddress });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositFormVal(e.target.value);
    !formTouched && setFormTouched(true);
  };

  if (!chain) return <ConnectWallet />;
  return (
    <React.Fragment>
      <label>
        Deposit Amount: <input name='Deposit Amount' placeholder='0.00' value={depositFormVal} type='text' onChange={(e) => handleFormChange(e)} />
        <div>
          <button onClick={() => setDepositFormVal(tokenBalances.depositTokenBalance)}>Max</button>
        </div>
      </label>
      <BeefyVaultDepositButton
        allowed={allowances.vaultTokenAllowance >= tokenBalances.vaultTokenBalance}
        amount={depositAmount}
        contractAddress={vaultAddress}
        depositTokenAddress={depositTokenAddress}
      />
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
          <button onClick={() => setWithdrawalFormVal(tokenBalances.vaultTokenBalance)}>Max</button>
        </div>
      </label>
      <BeefyVaultWithdrawButton
        allowed={allowances.depositTokenAllowance >= tokenBalances.depositTokenBalance}
        amount={withdrawalAmount}
        contractAddress={vaultAddress}
      />
    </React.Fragment>
  );
}
