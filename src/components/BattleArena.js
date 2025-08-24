import React, { useState, useEffect } from 'react';
import './BattleArena.css';

const BattleArena = ({ 
  walletState, 
  currentPet, 
  battleSystem,
  onBattleResult
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);

  const BATTLE_COST = 0.0002;
  const WINNER_REWARD = 0.0004;

  // Handle 1v1 battle
  const handleBattle = async () => {
    if (!walletState.isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!currentPet || !currentPet.isAlive) {
      alert('You need an alive pet to battle!');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    
    // Show battle animation for 2 seconds
    setTimeout(() => {
      // Determine winner based on 50/50 chance
      const isWinner = Math.random() >= 0.5;
      
      // Send result to parent App component for full-screen modal
      onBattleResult({
        isWinner,
        earnings: isWinner ? WINNER_REWARD : -BATTLE_COST,
        opponent: {
          name: 'Random Fighter',
          level: Math.floor(Math.random() * 10) + 1
        }
      });
      
      setIsSpinning(false);
    }, 2000); // 2 second battle
  };

  // Format ETH amount
  const formatETH = (amount) => {
    return `${Math.abs(amount)} ETH`;
  };

  return (
    <div className="battle-arena">
      <div className="battle-header">
        <h2>⚔️ Battle Arena (Prototype)</h2>
      </div>

      <div className="battle-content">
        {/* Current Pet Info */}
        <div className="current-pet-info">
          {currentPet ? (
            <div className="pet-battle-card">
              <h3>🚀 {currentPet.name || 'P.A.S.E Entity'}</h3>
              <div className="pet-status">
                Status: {currentPet.isAlive ? '✅ Ready to Battle' : '💀 Needs Revival'}
              </div>
            </div>
          ) : (
            <div className="no-pet">❌ No P.A.S.E available for battle</div>
          )}
        </div>

        {/* Battle Arena */}
        <div className="battle-arena-container">
          <div className="battle-title">⚔️ 1v1 Battle Arena</div>
          <div className="battle-fighters">
            <div className="fighter my-fighter">
              <div className="fighter-avatar">🚀</div>
              <div className="fighter-name">{currentPet?.name || 'Your P.A.S.E'}</div>
              <div className="fighter-level">Lv.{currentPet?.level || 1}</div>
            </div>
            
            <div className="vs-indicator">
              {isSpinning ? (
                <div className="battle-animation">⚡</div>
              ) : (
                <div className="vs-text">VS</div>
              )}
            </div>
            
            <div className="fighter opponent-fighter">
              <div className="fighter-avatar">🤖</div>
              <div className="fighter-name">Random Fighter</div>
              <div className="fighter-level">Lv.{Math.floor(Math.random() * 10) + 1}</div>
            </div>
          </div>
        </div>

        {/* Battle Info */}
        <div className="battle-info">
          <div className="battle-cost-info">
            <div>💰 Battle Cost: <strong>{formatETH(BATTLE_COST)}</strong></div>
            <div>🏆 Winner Reward: <strong>{formatETH(WINNER_REWARD)}</strong></div>
            <div>⚖️ Win Rate: <strong>50/50 chance</strong></div>
          </div>
        </div>

        {/* Battle Button */}
        <div className="battle-actions">
          {!isSpinning ? (
            <button 
              className="battle-btn"
              onClick={handleBattle}
              disabled={!walletState.isConnected || !currentPet?.isAlive}
            >
              {!walletState.isConnected 
                ? '🔗 Connect Wallet First' 
                : !currentPet?.isAlive 
                  ? '💀 P.A.S.E Needs Revival'
                  : '⚔️ START BATTLE!'
              }
            </button>
          ) : (
            <div className="battle-status">
              <div className="battle-text">⚡ Battle in progress...</div>
              <div className="battle-subtext">Fighting opponent...</div>
            </div>
          )}
        </div>

        {/* Prototype Notice */}
        <div className="prototype-notice">
          <small>⚠️ This is a prototype version with 50/50 random chance</small>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;