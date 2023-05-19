# firepot-dapp
DeFi for your mom

# Development Environment
## Required
### Copy Env Frame
Go to your open terminal in the firepot-dapp folder. Copy .env.example into a .env file
```sh 
cp .env.example .env
```

### Alchemy Keys
Firepot uses Alchemy as its default RPC provider. You'll need to setup your local environment with your free Alchemy API keys.
1. Go to [https://www.alchemy.com/](https://www.alchemy.com/). Create an account, and a project. Leave Ethereum as the default chain for the project.
2. Select "VIEW KEY" and copy your API KEY. Paste into .env

### Infura Keys
Firepot uses Infura as its backup RPC provider, and support for chains that Alchemy doesn't support. You'll need to setup your local environment with your free Infura API keys.
1. Go to [https://infura.io](https://infura.io) and sign up for an account. Create a project, and copy your api key.
2. Paste into .env.

### Ankr Keys
To support even MORE networks, Firepot uses Ankr as its backup-backup RPC provider. You'll need to setup your local environment with your free Infura API keys.
1. Go to [https://ankr.com/rpc](https://ankr.com/rpc) and sign up for an account. Create a project, and copy your api key.
2. Paste into .env.

## (Optional)
### WalletConnect ProjectId
To enable WalletConnect, con
1. Go to [https://cloud.walletconnect.com/sign-in](https://cloud.walletconnect.com/sign-in). Create an account, and a project.
2. Copy projectId. Paste into .env.


# Documentation
- [Wagmi](https://wagmi.sh/)
- [RainbowKit](https://www.rainbowkit.com/docs/introduction)
