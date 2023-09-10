import { assertIsDefined } from './assertion';

const envs = [
  'VITE_ALCHEMY_KEY',
  'VITE_INUFRA_KEY',
  'VITE_ANKR_KEY',
  'VITE_WALLETCONNECT_PROJECT_ID',
  'VITE_IS_MAINNET',
  'VITE_BUY_HOTT_URL',
  'VITE_MAINNET_HOTT_CONTRACT_ADDRESS',
  'VITE_MAINNET_RHOTT_CONTRACT_ADDRESS',
  'VITE_MAINNET_REWARDS_CONTRACT_ADDRESS',
  'VITE_TESTNET_HOTT_CONTRACT_ADDRESS',
  'VITE_TESTNET_RHOTT_CONTRACT_ADDRESS',
  'VITE_TESTNET_REWARDS_CONTRACT_ADDRESS',
  'DEV',
] as const;
type Env = (typeof envs)[number];

export function assertEnv() {
  envs.forEach((env) => assertIsDefined(env, import.meta.env[env]));
}

export function getEnv(env: Env) {
  const value = import.meta.env[env];
  assertIsDefined(env, value);
  return value as string;
}
