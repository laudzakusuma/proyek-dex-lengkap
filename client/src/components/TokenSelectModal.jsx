import React from 'react';

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

export default TokenSelectModal;