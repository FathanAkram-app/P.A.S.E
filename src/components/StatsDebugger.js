import React from 'react';

const StatsDebugger = ({ petStats, walletAddress, nftId }) => {
  const storageKey = walletAddress && nftId ? `pet_stats_${walletAddress}_${nftId}` : 'pet_stats_default';
  
  const checkLocalStorage = () => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log('🔍 Current saved data:', parsed);
      alert(`Stats are being saved! Check console for details.\nHunger: ${parsed.hunger}, XP: ${parsed.experience}`);
    } else {
      alert('No saved data found yet. Try feeding your pet first!');
    }
  };

  const clearSavedData = () => {
    localStorage.removeItem(storageKey);
    if (walletAddress) {
      const walletStats = JSON.parse(localStorage.getItem(`wallet_stats_${walletAddress}`) || '{}');
      delete walletStats[nftId || 'default'];
      localStorage.setItem(`wallet_stats_${walletAddress}`, JSON.stringify(walletStats));
    }
    alert('Saved data cleared! Stats will reset on next page refresh.');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      left: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <div><strong>🔧 Stats Debugger</strong></div>
      <div>Storage Key: {storageKey}</div>
      <div>Current Hunger: {Math.round(petStats.hunger)}</div>
      <div>Current XP: {petStats.experience}</div>
      <div>Total Interactions: {petStats.totalInteractions}</div>
      <div style={{ marginTop: '5px' }}>
        <button onClick={checkLocalStorage} style={{ marginRight: '5px', fontSize: '10px' }}>
          Check Saved
        </button>
        <button onClick={clearSavedData} style={{ fontSize: '10px' }}>
          Clear Data
        </button>
      </div>
    </div>
  );
};

export default StatsDebugger;