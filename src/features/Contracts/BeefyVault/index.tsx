import { useNetwork } from 'wagmi';
import { useBeefyVaultDeposit, useBeefyVaultWithdraw } from './hooks';
import { ConnectWallet } from '../../ConnectWallet';

export function BeefyVaultDepositButton({ amount, contractAddress}: { amount: bigint, contractAddress: `0x${string}`}) {
  const { chain } = useNetwork();
  const { write } = useBeefyVaultDeposit(amount, { contractAddress, chainId: chain?.id! });
  if (!chain) return <ConnectWallet />
  return <button onClick={() => write?.()}>Deposit</button>;
}

export function BeefyVaultWithdrawButton({ amount, contractAddress}: { amount: bigint, contractAddress: `0x${string}`}) {
  const { chain } = useNetwork();
  const { write } = useBeefyVaultWithdraw(amount, { contractAddress, chainId: chain?.id! });
  if (!chain) return <ConnectWallet />
  return <button onClick={() => write?.()}>Withdraw</button>;
}
