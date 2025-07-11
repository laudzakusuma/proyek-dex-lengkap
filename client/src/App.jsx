import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

// -- STYLING (CSS KUSTOM) --
// Menambahkan style untuk Modal
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :root { --bg-color: #101018; --primary-color: #2a2d3e; --secondary-color: #1c1e2a; --accent-color: #6c5ce7; --accent-hover: #5a4bdb; --text-primary: #f0f0f5; --text-secondary: #a0a0b0; --border-color: rgba(255, 255, 255, 0.1); }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-primary); overflow-x: hidden; }
    @keyframes background-pan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    .app-container { min-height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; padding: 2rem; background: linear-gradient(120deg, var(--bg-color), #181524, var(--bg-color)); background-size: 200% 200%; animation: background-pan 15s ease infinite; }
    .header { width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; animation: fadeInDown 0.8s ease-out; }
    .header-logo { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
    .connect-wallet-btn { background-color: var(--accent-color); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); }
    .connect-wallet-btn:hover { background-color: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4); }
    .connected-indicator { background-color: var(--primary-color); padding: 0.75rem 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); }
    .main-content { display: flex; justify-content: center; align-items: flex-start; gap: 4rem; width: 100%; max-width: 1200px; animation: fadeInUp 0.8s ease-out 0.2s; animation-fill-mode: backwards; }
    .swap-panel { flex: 1; max-width: 480px; background: rgba(28, 30, 42, 0.5); border-radius: 24px; border: 1px solid var(--border-color); padding: 2rem; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); }
    .swap-panel-header { font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; }
    .token-input-container { background-color: var(--secondary-color); padding: 1rem; border-radius: 16px; margin-bottom: 1rem; }
    .token-input-header { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
    .token-input-main { display: flex; align-items: center; gap: 1rem; }
    .token-select-btn { display: flex; align-items: center; gap: 0.5rem; background-color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 12px; cursor: pointer; font-weight: 500; border: 1px solid transparent; transition: all 0.2s ease; }
    .token-select-btn:hover { border-color: var(--accent-color); }
    .token-input { width: 100%; background: transparent; border: none; color: var(--text-primary); font-size: 1.75rem; font-weight: 500; text-align: right; outline: none; }
    .swap-icon-container { display: flex; justify-content: center; margin: -1.75rem 0; z-index: 10; }
    .swap-icon-btn { width: 40px; height: 40px; border-radius: 50%; background-color: var(--primary-color); border: 3px solid var(--bg-color); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
    .swap-icon-btn:hover { transform: rotate(180deg); background-color: var(--accent-color); }
    .swap-details { margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .execute-swap-btn { width: 100%; background-color: var(--accent-color); color: white; border: none; padding: 1rem; margin-top: 1.5rem; border-radius: 16px; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
    .execute-swap-btn:hover { background-color: var(--accent-hover); transform: translateY(-2px); }
    .execute-swap-btn:disabled { background-color: var(--primary-color); cursor: not-allowed; color: var(--text-secondary); }
    
    /* --- PERBAIKAN CSS DI SINI --- */
    .three-d-container { 
      flex: 1;
      min-height: 400px;
      max-width: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: stretch; /* Membuat container meregang setinggi parent */
    }
    
    /* Style untuk Modal */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s ease; }
    .modal-content { background: var(--primary-color); padding: 1.5rem; border-radius: 16px; width: 90%; max-width: 400px; border: 1px solid var(--border-color); animation: zoomIn 0.3s ease; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .modal-title { font-size: 1.2rem; font-weight: 600; }
    .modal-close-btn { background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; }
    .token-list { max-height: 400px; overflow-y: auto; }
    .token-list-item { display: flex; align-items: center; padding: 1rem; border-radius: 12px; cursor: pointer; transition: background-color 0.2s ease; }
    .token-list-item:hover { background-color: var(--secondary-color); }
    .token-list-item-info { display: flex; flex-direction: column; }
    .token-symbol { font-weight: 600; }
    .token-name { font-size: 0.875rem; color: var(--text-secondary); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { transform: scale(0.9); } to { transform: scale(1); } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 992px) { .main-content { flex-direction: column; align-items: center; } .three-d-container { width: 100%; margin-top: 2rem; align-self: auto; } }
  `}</style>
);

// -- KOMPONEN 3D (Bintang dihilangkan) --
const Token3D = () => {
  const modelRef = useRef();
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x += 0.001;
      modelRef.current.rotation.y += 0.003;
    }
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      {/* Komponen <Stars /> telah dihapus dari sini */}
      <TorusKnot ref={modelRef} args={[1, 0.3, 200, 22]}>
        <meshStandardMaterial color="#6c5ce7" metalness={0.8} roughness={0.1} />
      </TorusKnot>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

// -- KOMPONEN MODAL BARU --
const TokenSelectModal = ({ tokens, isOpen, onClose, onSelectToken }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Pilih Token</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="token-list">
          {Object.values(tokens).map(token => (
            <div key={token.symbol} className="token-list-item" onClick={() => onSelectToken(token.symbol)}>
              <div className="token-list-item-info">
                <span className="token-symbol">{token.symbol}</span>
                <span className="token-name">{token.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -- KOMPONEN UTAMA APLIKASI --
function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokens, setTokens] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State baru untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null); // 'from' atau 'to'

  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetch(`${API_URL}/api/tokens`)
      .then(res => res.json())
      .then(data => {
        setTokens(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data token:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (fromToken && toToken && tokens) {
      fetch(`${API_URL}/api/rate?from=${fromToken}&to=${toToken}`)
        .then(res => res.json())
        .then(data => {
          setExchangeRate(data.rate);
          if (fromAmount > 0) {
            setToAmount((fromAmount * data.rate).toFixed(4));
          } else {
            setToAmount('');
          }
        })
        .catch(error => console.error("Gagal mengambil kurs:", error));
    }
  }, [fromToken, toToken, fromAmount, tokens]);
  
  // Fungsi untuk membuka modal
  const openModal = (selectionType) => {
    setSelectingFor(selectionType);
    setIsModalOpen(true);
  };

  // Fungsi untuk memilih token dari modal
  const handleSelectToken = (symbol) => {
    if (selectingFor === 'from') {
      if (symbol === toToken) { // Jika token yg dipilih sama, tukar
        setFromToken(symbol);
        setToToken(fromToken);
      } else {
        setFromToken(symbol);
      }
    } else { // selectingFor 'to'
      if (symbol === fromToken) { // Jika token yg dipilih sama, tukar
        setToToken(symbol);
        setFromToken(toToken);
      } else {
        setToToken(symbol);
      }
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
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    if (parseFloat(fromAmount) > tokens[fromToken].balance) return;
    alert(`Sukses! Anda menukar ${fromAmount} ${fromToken} dengan ${toAmount} ${toToken}. (Simulasi)`);
    setFromAmount('');
    setToAmount('');
  };

  if (isLoading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Memuat data dari server...</div>;
  }

  return (
    <>
      <GlobalStyles />
      <TokenSelectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={tokens}
        onSelectToken={handleSelectToken}
      />
      <div className="app-container">
        <header className="header">
          <div className="header-logo">Tukar<span style={{color: "var(--accent-color)"}}>Desentral</span></div>
          {!walletConnected ? (
            <button className="connect-wallet-btn" onClick={handleConnectWallet}>Sambungkan Dompet</button>
          ) : (
            <div className="connected-indicator">{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</div>
          )}
        </header>

        <main className="main-content">
          <div className="swap-panel">
            <h2 className="swap-panel-header">Tukar Token</h2>

            <div className="token-input-container">
              <div className="token-input-header">
                <span>Anda bayar</span>
                <span>Saldo: {tokens[fromToken]?.balance.toFixed(2)}</span>
              </div>
              <div className="token-input-main">
                <button className="token-select-btn" onClick={() => openModal('from')}>{fromToken} ▼</button>
                <input type="number" className="token-input" placeholder="0.0" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} />
              </div>
            </div>

            <div className="swap-icon-container">
              <button className="swap-icon-btn" onClick={handleFlipTokens}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 4V14H19V4H17ZM13 14H15L12 18L9 14H11V4H13V14ZM7 10H5V20H7V10Z" /></svg>
              </button>
            </div>

            <div className="token-input-container">
              <div className="token-input-header">
                <span>Anda terima</span>
                <span>Saldo: {tokens[toToken]?.balance.toFixed(2)}</span>
              </div>
              <div className="token-input-main">
                <button className="token-select-btn" onClick={() => openModal('to')}>{toToken} ▼</button>
                <input type="number" className="token-input" placeholder="0.0" value={toAmount} readOnly />
              </div>
            </div>
            
            {fromAmount > 0 && (
              <div className="swap-details">
                <div className="detail-row">
                  <span>Kurs</span>
                  <span>1 {fromToken} ≈ {exchangeRate.toFixed(4)} {toToken}</span>
                </div>
              </div>
            )}

            <button className="execute-swap-btn" onClick={handleSwap} disabled={!walletConnected || !fromAmount || parseFloat(fromAmount) <= 0}>
              {walletConnected ? 'Tukar' : 'Sambungkan Dompet Dulu'}
            </button>
          </div>

          <div className="three-d-container">
            <Suspense fallback={<div>Memuat model 3D...</div>}>
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Token3D />
              </Canvas>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;