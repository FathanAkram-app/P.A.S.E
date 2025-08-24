import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import ChatInterface from './components/ChatInterface';
import StatsPanel from './components/StatsPanel';
import WalletConnector from './components/WalletConnector';
import Marketplace from './components/Marketplace';
import BattleArena from './components/BattleArena';
import { useWallet } from './hooks/useWallet';
import { usePetController } from './hooks/usePetController';
import { initializeAudioFix } from './utils/audioFix';
import './App.css';

function App() {
  // Wallet connection state
  const { walletState, connectWallet, disconnectWallet } = useWallet();
  
  // Unified pet system - handles both NFTs and stats
  const {
    currentPet,
    ownedNFTs,
    isLoading,
    isMinting,
    lastSaved,
    error,
    feed,
    play,
    sleep,
    pet,
    revive,
    killPet,
    switchToPet,
    createNewPet,
    createMarketplacePet,
    resetStats,
    stats,
    battleSystem
  } = usePetController(walletState.address);
  
  // Game state
  const [gameLoaded, setGameLoaded] = useState(false);
  const [petInteractions, setPetInteractions] = useState([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  
  // Simple UI state
  const [uiState, setUiState] = useState({
    leftPanelOpen: false,
    rightPanelOpen: false,
    battlePanelOpen: false,
    chatOpen: false
  });

  // Battle result modal state
  const [battleResult, setBattleResult] = useState(null);

  const toggleLeftPanel = () => setUiState(prev => ({ ...prev, leftPanelOpen: !prev.leftPanelOpen }));
  const toggleRightPanel = () => setUiState(prev => ({ ...prev, rightPanelOpen: !prev.rightPanelOpen }));
  const toggleBattlePanel = () => setUiState(prev => ({ ...prev, battlePanelOpen: !prev.battlePanelOpen }));
  const toggleChat = () => setUiState(prev => ({ ...prev, chatOpen: !prev.chatOpen }));

  // Handle battle results from BattleArena
  const handleBattleResult = (result) => {
    setBattleResult(result);
  };

  // Close battle result modal
  const closeBattleResult = () => {
    setBattleResult(null);
  };

  // Handle pet interaction from chat
  const handlePetInteraction = async (action, message) => {
    console.log(`🎮 Pet interaction received: ${action} - ${message}`);
    
    let result = null;
    
    try {
      switch (action.toLowerCase()) {
        case 'feed':
          result = await feed();
          break;
        case 'play':
          result = await play();
          break;
        case 'sleep':
          result = await sleep();
          break;
        case 'pet':
          result = await pet();
          break;
        case 'revive':
          result = await revive();
          break;
        case 'kill':
          result = await killPet();
          break;
        default:
          result = { success: true, message: 'Thanks for talking to me! ✨' };
      }
      
      console.log('✅ Action result:', result);
      
    } catch (error) {
      console.error('❌ Action failed:', error);
      result = { success: false, message: 'Something went wrong!' };
    }
    
    // Add to interaction history
    setPetInteractions(prev => [...prev.slice(-9), {
      id: Date.now(),
      action,
      message,
      timestamp: new Date(),
      result: result
    }]);
  };

  // Handle pet selection
  const handleSelectPet = async (selectedPet) => {
    try {
      await switchToPet(selectedPet.tokenId);
      console.log(`🎯 Switched to pet ${selectedPet.tokenId}`);
    } catch (error) {
      console.error('Failed to switch pet:', error);
    }
  };

  // Handle minting new pet
  const handleMintPet = async (initialStats = null, characteristics = {}) => {
    try {
      const result = await createNewPet(characteristics);
      console.log('🎉 New pet created:', result);
      return result;
    } catch (error) {
      console.error('Failed to mint pet:', error);
      throw error;
    }
  };

  // Initialize audio error suppression
  useEffect(() => {
    initializeAudioFix();
  }, []);

  return (
    <div className="App">
      {/* Full Screen Game Canvas */}
      <div className="fullscreen-game">
        <GameCanvas 
          petStats={stats}
          currentPet={currentPet}
          petCount={ownedNFTs.length}
          onGameLoaded={() => setGameLoaded(true)}
          interactions={petInteractions}
        />
      </div>

      {/* Compact Header */}
      <div className="compact-header">
        <div className="header-left">
          <div className="game-logo">🚀 P.A.S.E</div>
          <div className="header-controls">
            <button 
              className={`compact-btn ${uiState.leftPanelOpen ? 'active' : ''}`}
              onClick={toggleLeftPanel}
            >
              📊 Stats
            </button>
          </div>
        </div>
        
        <div className="header-controls">
          <button 
            className={`compact-btn ${uiState.rightPanelOpen ? 'active' : ''}`}
            onClick={toggleRightPanel}
          >
            🚀 Shop
          </button>
          <button 
            className={`compact-btn ${uiState.battlePanelOpen ? 'active' : ''}`}
            onClick={toggleBattlePanel}
          >
            ⚔️ Battle
          </button>
          
          {!walletState.isConnected ? (
            <button 
              className="compact-btn"
              onClick={connectWallet}
              disabled={walletState.isConnecting}
            >
              {walletState.isConnecting ? '⏳' : '🔗 Connect'}
            </button>
          ) : (
            <div className="wallet-display">
              <span>🔗</span>
              <span>{walletState.address?.substring(0, 4)}...{walletState.address?.substring(walletState.address.length - 3)}</span>
              <button 
                className="compact-btn" 
                onClick={disconnectWallet}
                style={{ padding: '2px 6px', fontSize: '10px' }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* UI Overlay with Floating Cards */}
      <div className="ui-overlay">
        {/* Stats Card */}
        {uiState.leftPanelOpen && (
          <div className="card-container stats-card">
            <div className="ui-card">
              <div className="card-header">
                <div className="card-title">📊 P.A.S.E Statistics</div>
                <button className="card-close" onClick={toggleLeftPanel}>✕</button>
              </div>
              <div className="card-content">
                <StatsPanel 
                  stats={stats}
                  nftData={currentPet}
                  walletConnected={walletState.isConnected}
                />
              </div>
            </div>
          </div>
        )}

        {/* Marketplace Card */}
        {uiState.rightPanelOpen && (
          <div className="card-container marketplace-card">
            <div className="ui-card">
              <div className="card-header">
                <div className="card-title">🚀 P.A.S.E Marketplace</div>
                <button className="card-close" onClick={toggleRightPanel}>✕</button>
              </div>
              <div className="card-content">
                <Marketplace 
                  walletState={walletState}
                  ownedNFTs={ownedNFTs}
                  currentPet={currentPet}
                  isMinting={isMinting}
                  mintError={error}
                  onMintPet={handleMintPet}
                  onMintMarketplacePet={createMarketplacePet}
                  onSelectPet={handleSelectPet}
                />
              </div>
            </div>
          </div>
        )}

        {/* Battle Arena Card */}
        {uiState.battlePanelOpen && (
          <div className="card-container battle-card">
            <div className="ui-card">
              <div className="card-header">
                <div className="card-title">⚔️ Battle Arena</div>
                <button className="card-close" onClick={toggleBattlePanel}>✕</button>
              </div>
              <div className="card-content">
                <BattleArena 
                  walletState={walletState}
                  currentPet={currentPet}
                  battleSystem={battleSystem}
                  onBattleResult={handleBattleResult}
                />
              </div>
            </div>
          </div>
        )}

        {/* Chat Card */}
        {uiState.chatOpen && (
          <div className="card-container chat-card">
            <div className="ui-card">
              <div className="card-header">
                <div className="card-title">💬 P.A.S.E Chat</div>
                <button className="card-close" onClick={toggleChat}>✕</button>
              </div>
              <div className="card-content">
                <ChatInterface 
                  onInteraction={handlePetInteraction}
                  petStats={stats}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <button 
          className={`quick-action ${uiState.chatOpen ? 'active' : ''}`}
          onClick={toggleChat}
          title="Chat"
        >
          💬
        </button>
      </div>

      {/* Full Screen Battle Result Modal */}
      {battleResult && (
        <div className="battle-result-modal">
          <div className="battle-result-content">
            {battleResult.isWinner ? (
              <>
                <h3>🎉 Congratulations!</h3>
                <div className="result-message">
                  You Won 0.0004 ETH!
                </div>
              </>
            ) : (
              <>
                <h3>💀 You Lost!</h3>
                <div className="result-message">
                  Better luck next time!
                </div>
              </>
            )}
            <button className="close-result-btn" onClick={closeBattleResult}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;