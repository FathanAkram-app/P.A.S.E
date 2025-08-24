import React, { useState } from 'react';
import './WalletConnector.css';

const WalletConnector = ({ walletState, onConnect, onDisconnect }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    try {
      const result = await onConnect();
      if (!result.success) {
        alert(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await onDisconnect();
      setShowDropdown(false);
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (balance) => {
    if (typeof balance !== 'number') return '0.00';
    return balance.toFixed(4);
  };

  if (!walletState.isConnected) {
    return (
      <div className="wallet-connector">
        <button
          className="connect-button"
          onClick={handleConnect}
          disabled={walletState.isConnecting}
        >
          {walletState.isConnecting ? (
            <>
              <div className="spinner" />
              Connecting...
            </>
          ) : (
            <>
              🔗 Connect Wallet
            </>
          )}
        </button>
        
        {walletState.error && (
          <div className="wallet-error">
            ⚠️ {walletState.error}
          </div>
        )}
        
        <div className="wallet-info">
          <small>Connect your wallet to mint and save your pet as an NFT</small>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connector connected">
      <div 
        className="wallet-display"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="address-label">🔗</span>
            <span className="address-text">{formatAddress(walletState.address)}</span>
          </div>
          <div className="wallet-network">
            <span className="network-indicator" />
            <span className="network-text">{walletState.network}</span>
          </div>
        </div>
        
        <div className="dropdown-arrow">
          {showDropdown ? '▲' : '▼'}
        </div>
      </div>

      {showDropdown && (
        <div className="wallet-dropdown">
          <div className="dropdown-section">
            <div className="dropdown-item">
              <span className="item-label">Address:</span>
              <span className="item-value" title={walletState.address}>
                {formatAddress(walletState.address)}
              </span>
            </div>
            
            <div className="dropdown-item">
              <span className="item-label">Network:</span>
              <span className="item-value">{walletState.network}</span>
            </div>
            
            <div className="dropdown-item">
              <span className="item-label">Balance:</span>
              <span className="item-value">
                {formatBalance(walletState.balance)} ETH
              </span>
            </div>
          </div>

          <div className="dropdown-actions">
            <button 
              className="action-button copy-button"
              onClick={(event) => {
                navigator.clipboard.writeText(walletState.address);
                // Show copied feedback
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✓ Copied!';
                setTimeout(() => {
                  button.textContent = originalText;
                }, 2000);
              }}
            >
              📋 Copy Address
            </button>
            
            <button 
              className="action-button disconnect-button"
              onClick={handleDisconnect}
            >
              🔌 Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default WalletConnector;