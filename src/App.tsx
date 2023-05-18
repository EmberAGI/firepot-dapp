import Home from '.';
import './App.css'
import Header from './components/Header';
import ConnectWalletConfig from './features/ConnectWallet';

const App: React.FC = () => {
  return (
    <ConnectWalletConfig>
      <Header/>
      <Home/>
    </ConnectWalletConfig>
  );
};

export default App
