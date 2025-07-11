import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Token3D from '../components/Token3D';

const ExchangePage = ({ tokens, walletConnected, handleSwap, ...props }) => {
  return (
    <div className="exchange-content">
      <div className="swap-panel">
        <h2 className="swap-panel-header">Tukar Token</h2>
        <div className="token-input-container">
          <div className="token-input-header">
            <span>Anda bayar</span>
            <span>Saldo: {tokens[props.fromToken]?.balance.toFixed(2)}</span>
          </div>
          <div className="token-input-main">
            <button className="token-select-btn" onClick={() => props.openModal('from')}>{props.fromToken} ▼</button>
            <input type="number" className="token-input" placeholder="0.0" value={props.fromAmount} onChange={(e) => props.setFromAmount(e.target.value)} />
          </div>
        </div>
        <div className="swap-icon-container">
          <button className="swap-icon-btn" onClick={props.handleFlipTokens}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 4V14H19V4H17ZM13 14H15L12 18L9 14H11V4H13V14ZM7 10H5V20H7V10Z" /></svg>
          </button>
        </div>
        <div className="token-input-container">
          <div className="token-input-header">
            <span>Anda terima</span>
            <span>Saldo: {tokens[props.toToken]?.balance.toFixed(2)}</span>
          </div>
          <div className="token-input-main">
            <button className="token-select-btn" onClick={() => props.openModal('to')}>{props.toToken} ▼</button>
            <input type="number" className="token-input" placeholder="0.0" value={props.toAmount} readOnly />
          </div>
        </div>
        {props.fromAmount > 0 && (
          <div className="swap-details">
            <div className="detail-row">
              <span>Kurs</span>
              <span>1 {props.fromToken} ≈ {props.exchangeRate.toFixed(4)} {props.toToken}</span>
            </div>
          </div>
        )}
        <button className="execute-swap-btn" onClick={handleSwap} disabled={!walletConnected || !props.fromAmount || parseFloat(props.fromAmount) <= 0}>
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
    </div>
  );
};

export default ExchangePage;