import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import TokenSelectModal from './components/TokenSelectModal';
import ExchangePage from './pages/ExchangePage';
import NewsPage from './pages/NewsPage';
import ChartPage from './pages/ChartPage';
import ChatPage from './pages/ChatPage';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('exchange');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokens, setTokens] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null);

  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetch(`${API_URL}/api/tokens`).then(res => res.json()).then(data => {
      setTokens(data);
      setIsLoading(false);
    }).catch(error => {
      console.error("Gagal mengambil data token:", error);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (fromToken && toToken && tokens) {
      fetch(`${API_URL}/api/rate?from=${fromToken}&to=${toToken}`).then(res => res.json()).then(data => {
        setExchangeRate(data.rate);
        if (fromAmount > 0) setToAmount((fromAmount * data.rate).toFixed(4));
        else setToAmount('');
      }).catch(error => console.error("Gagal mengambil kurs:", error));
    }
  }, [fromToken, toToken, fromAmount, tokens]);

  const openModal = (selectionType) => {
    setSelectingFor(selectionType);
    setIsModalOpen(true);
  };

  const handleSelectToken = (symbol) => {
    if (selectingFor === 'from') {
      if (symbol === toToken) { setFromToken(symbol); setToToken(fromToken); } 
      else { setFromToken(symbol); }
    } else {
      if (symbol === fromToken) { setToToken(symbol); setFromToken(toToken); } 
      else { setToToken(symbol); }
    }
    setIsModalOpen(false);
  };

  const handleConnectWallet = () => {
    const mockAddress = "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setWalletAddress(mockAddress);
    setWalletConnected(true);
  };

  const handleFlipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > tokens[fromToken].balance) return;
    alert(`Sukses! Anda menukar ${fromAmount} ${fromToken} dengan ${toAmount} ${toToken}. (Simulasi)`);
    setFromAmount('');
    setToAmount('');
  };

  // --- RENDER LOGIC ---
  const renderPage = () => {
    if (isLoading) {
      return <div style={{color: 'white'}}>Memuat data...</div>;
    }
    switch (activePage) {
      case 'exchange':
        return <ExchangePage 
                  tokens={tokens} 
                  walletConnected={walletConnected} 
                  handleSwap={handleSwap}
                  fromToken={fromToken} toToken={toToken}
                  fromAmount={fromAmount} toAmount={toAmount}
                  setFromAmount={setFromAmount}
                  exchangeRate={exchangeRate}
                  openModal={openModal}
                  handleFlipTokens={handleFlipTokens}
                />;
      case 'news':
        return <NewsPage />;
      case 'charts':
        return <ChartPage />;
      case 'chat':
        return <ChatPage />;
      default:
        return <ExchangePage />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        activePage={activePage}
        setActivePage={setActivePage}
        walletConnected={walletConnected}
        handleConnectWallet={handleConnectWallet}
        walletAddress={walletAddress}
      />
      <TokenSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tokens={tokens || {}} 
        onSelectToken={handleSelectToken} 
      />
      <main className="page-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;