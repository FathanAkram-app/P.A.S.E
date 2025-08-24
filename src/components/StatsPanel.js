import React from 'react';
import './StatsPanel.css';

const StatsPanel = ({ stats, nftData, walletConnected }) => {
  // Calculate level from experience
  const currentLevel = Math.floor(stats.experience / 100) + 1;
  const expToNextLevel = 100 - (stats.experience % 100);

  // Determine overall pet condition
  const getOverallCondition = () => {
    const average = (stats.hunger + stats.happiness + stats.energy + stats.health) / 4;
    
    if (average >= 80) return { text: 'Excellent', color: '#10b981', emoji: '😄' };
    if (average >= 60) return { text: 'Good', color: '#3b82f6', emoji: '😊' };
    if (average >= 40) return { text: 'Fair', color: '#f59e0b', emoji: '😐' };
    if (average >= 20) return { text: 'Poor', color: '#ef4444', emoji: '😟' };
    return { text: 'Critical', color: '#dc2626', emoji: '😢' };
  };

  const condition = getOverallCondition();

  // Stat bar component
  const StatBar = ({ label, value, max = 100, color, icon }) => (
    <div className="stat-item">
      <div className="stat-header">
        <span className="stat-label">
          {icon} {label}
        </span>
        <span className="stat-value">{Math.round(value)}/{max}</span>
      </div>
      <div className="stat-bar">
        <div 
          className="stat-fill" 
          style={{ 
            width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`,
            backgroundColor: color 
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h3>📊 Pet Status</h3>
        <div className="overall-condition" style={{ color: condition.color }}>
          {condition.emoji} {condition.text}
        </div>
      </div>

      <div className="stats-grid">
        {/* Primary Stats */}
        <StatBar 
          label="Health" 
          value={stats.health} 
          color="#ef4444" 
          icon="❤️"
        />
        
        <StatBar 
          label="Hunger" 
          value={stats.hunger} 
          color="#f59e0b" 
          icon="🍎"
        />
        
        <StatBar 
          label="Happiness" 
          value={stats.happiness} 
          color="#10b981" 
          icon="😊"
        />
        
        <StatBar 
          label="Energy" 
          value={stats.energy} 
          color="#3b82f6" 
          icon="⚡"
        />

        {/* Experience and Level */}
        <div className="level-section">
          <div className="level-info">
            <span className="level-badge">🏆 Level {currentLevel}</span>
            <span className="exp-text">{stats.experience} EXP</span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-fill" 
              style={{ 
                width: `${((stats.experience % 100) / 100) * 100}%`,
                backgroundColor: '#8b5cf6'
              }}
            />
          </div>
          <div className="exp-to-next">
            {expToNextLevel} EXP to Level {currentLevel + 1}
          </div>
        </div>
      </div>

      {/* NFT Information */}
      <div className="nft-section">
        <h4>🎨 NFT Information</h4>
        {walletConnected ? (
          nftData ? (
            <div className="nft-info">
              <div className="nft-item">
                <span className="nft-label">Token ID:</span>
                <span className="nft-value">#{nftData.tokenId || 'N/A'}</span>
              </div>
              <div className="nft-item">
                <span className="nft-label">Name:</span>
                <span className="nft-value">{nftData.metadata?.name || 'My Digital Pet'}</span>
              </div>
              <div className="nft-item">
                <span className="nft-label">Blockchain:</span>
                <span className="nft-value">Shape Network</span>
              </div>
              <div className="nft-item">
                <span className="nft-label">Last Updated:</span>
                <span className="nft-value">
                  {nftData.lastUpdated ? 
                    new Date(nftData.lastUpdated).toLocaleString() : 
                    'Never'
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="no-nft">
              <p>🎯 No NFT found. Mint your pet to save stats on-chain!</p>
            </div>
          )
        ) : (
          <div className="wallet-disconnected">
            <p>🔗 Connect wallet to view NFT information</p>
          </div>
        )}
      </div>

      {/* Pet Care Tips */}
      <div className="care-tips">
        <h4>💡 Care Tips</h4>
        <div className="tips-list">
          {stats.hunger < 30 && (
            <div className="tip urgent">
              🍎 Your pet is hungry! Try saying "feed" in the chat.
            </div>
          )}
          {stats.energy < 30 && (
            <div className="tip urgent">
              💤 Your pet needs rest! Try saying "sleep" in the chat.
            </div>
          )}
          {stats.happiness < 30 && (
            <div className="tip urgent">
              🎾 Your pet is sad! Try saying "play" to cheer them up.
            </div>
          )}
          {stats.health < 30 && (
            <div className="tip critical">
              ⚠️ Health is low! Feed and rest your pet immediately!
            </div>
          )}
          {stats.hunger > 70 && stats.happiness > 70 && stats.energy > 70 && (
            <div className="tip positive">
              ✨ Your pet is doing great! Keep up the good work!
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="quick-summary">
        <div className="summary-item">
          <span>🎮 Interactions Today</span>
          <span>{Math.floor(stats.experience / 5) || 0}</span>
        </div>
        <div className="summary-item">
          <span>⏰ Pet Age</span>
          <span>{currentLevel} days</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;