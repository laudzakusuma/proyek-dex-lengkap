import React from 'react';

const Navbar = ({ activePage, setActivePage, walletConnected, handleConnectWallet, walletAddress }) => {
  const navItems = ['exchange', 'charts', 'news', 'chat'];

  return (
    <nav className="navbar">
      <div className="nav-left">Tukar<span style={{color: "var(--accent-color)"}}>Desentral</span></div>
      <div className="nav-links">
        {navItems.map(item => (
          <span
            key={item}
            className={`nav-link ${activePage === item ? 'active' : ''}`}
            onClick={() => setActivePage(item)}
            style={{textTransform: 'capitalize'}}
          >
            {item === 'news' ? 'Berita' : item}
          </span>
        ))}
      </div>
      <div className="nav-right">
        {!walletConnected ? (
          <button className="connect-wallet-btn" onClick={handleConnectWallet}>Sambungkan Dompet</button>
        ) : (
          <div className="connected-indicator">{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;