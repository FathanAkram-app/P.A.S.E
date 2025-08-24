import { useState, useEffect, useCallback } from 'react';

// PvP Battle System with ETH stakes
export const useBattleSystem = (walletAddress, currentPet) => {
  const [battleState, setBattleState] = useState({
    isSearching: false,
    currentBattle: null,
    battleHistory: [],
    queuedPlayers: [],
    isLoading: false,
    error: null
  });

  // Battle constants
  const BATTLE_COST = 0.0002; // ETH cost per battle
  const WINNER_REWARD = 0.0004; // ETH reward for winner (both players' stakes)

  // Load battle history and queue on mount
  useEffect(() => {
    if (walletAddress) {
      loadBattleHistory();
      loadBattleQueue();
    }
  }, [walletAddress]);

  // Load battle history from storage
  const loadBattleHistory = useCallback(() => {
    try {
      const history = localStorage.getItem(`battle_history_${walletAddress}`);
      if (history) {
        const parsed = JSON.parse(history);
        setBattleState(prev => ({ ...prev, battleHistory: parsed }));
      }
    } catch (error) {
      console.error('Failed to load battle history:', error);
    }
  }, [walletAddress]);

  // Load current battle queue
  const loadBattleQueue = useCallback(() => {
    try {
      const queue = localStorage.getItem('battle_queue');
      if (queue) {
        const parsed = JSON.parse(queue);
        setBattleState(prev => ({ ...prev, queuedPlayers: parsed }));
      }
    } catch (error) {
      console.error('Failed to load battle queue:', error);
    }
  }, []);

  // Save battle queue to storage
  const saveBattleQueue = useCallback((queue) => {
    try {
      localStorage.setItem('battle_queue', JSON.stringify(queue));
      setBattleState(prev => ({ ...prev, queuedPlayers: queue }));
    } catch (error) {
      console.error('Failed to save battle queue:', error);
    }
  }, []);

  // Calculate win probability based on levels
  const calculateWinProbability = useCallback((myLevel, opponentLevel) => {
    const totalLevels = myLevel + opponentLevel;
    const myProbability = myLevel / totalLevels;
    
    // Cap probability between 10% and 90% for fairness
    return Math.max(0.1, Math.min(0.9, myProbability));
  }, []);

  // Join battle queue
  const joinBattleQueue = useCallback(async () => {
    const petInfo = typeof currentPet === 'function' ? currentPet() : currentPet;
    
    // Safe check for pet alive status with fallback to true
    const isPetAlive = petInfo && (petInfo.isAlive !== undefined ? petInfo.isAlive : true);
    
    if (!walletAddress || !petInfo || !isPetAlive) {
      setBattleState(prev => ({ 
        ...prev, 
        error: 'Need connected wallet and alive pet to battle' 
      }));
      return { success: false, error: 'Invalid conditions for battle' };
    }

    setBattleState(prev => ({ ...prev, isSearching: true, error: null }));

    try {
      // Check if player has enough ETH (simulated)
      console.log(`💰 Battle cost: ${BATTLE_COST} ETH`);

      // Add player to queue
      const newQueueEntry = {
        walletAddress,
        petId: petInfo.tokenId || 'unknown',
        petName: petInfo.name || 'Unknown Pet',
        level: petInfo.level || 1,
        joinedAt: Date.now(),
        species: petInfo.species || 'Digital Pet',
        rarity: petInfo.rarity || 'Common'
      };

      const currentQueue = [...battleState.queuedPlayers];
      
      // Check if player already in queue
      const existingIndex = currentQueue.findIndex(p => p.walletAddress === walletAddress);
      if (existingIndex !== -1) {
        return { success: false, error: 'Already in battle queue' };
      }

      // Look for opponent
      const opponent = currentQueue.find(p => p.walletAddress !== walletAddress);
      
      if (opponent) {
        // Found opponent - start battle
        console.log('⚔️ Opponent found! Starting battle...');
        
        // Remove opponent from queue
        const updatedQueue = currentQueue.filter(p => p.walletAddress !== opponent.walletAddress);
        saveBattleQueue(updatedQueue);

        // Start battle
        const battleResult = await startBattle(newQueueEntry, opponent);
        setBattleState(prev => ({ ...prev, isSearching: false }));
        
        return battleResult;
      } else {
        // No opponent - join queue
        console.log('⏳ No opponent found, joining queue...');
        currentQueue.push(newQueueEntry);
        saveBattleQueue(currentQueue);

        setBattleState(prev => ({ ...prev, isSearching: true }));
        
        // Auto-check for opponents every 5 seconds
        setTimeout(() => checkForOpponents(), 5000);
        
        return { 
          success: true, 
          message: 'Joined battle queue! Searching for opponents...',
          queuePosition: currentQueue.length
        };
      }

    } catch (error) {
      console.error('Failed to join battle queue:', error);
      setBattleState(prev => ({ 
        ...prev, 
        isSearching: false, 
        error: error.message 
      }));
      return { success: false, error: error.message };
    }
  }, [walletAddress, currentPet, battleState.queuedPlayers, saveBattleQueue]);

  // Check for opponents periodically
  const checkForOpponents = useCallback(async () => {
    if (!battleState.isSearching) return;

    try {
      const currentQueue = JSON.parse(localStorage.getItem('battle_queue') || '[]');
      const myEntry = currentQueue.find(p => p.walletAddress === walletAddress);
      const opponent = currentQueue.find(p => p.walletAddress !== walletAddress);

      if (myEntry && opponent) {
        console.log('⚔️ Auto-match found! Starting battle...');
        
        // Remove both players from queue
        const updatedQueue = currentQueue.filter(
          p => p.walletAddress !== walletAddress && p.walletAddress !== opponent.walletAddress
        );
        saveBattleQueue(updatedQueue);

        // Start battle
        const battleResult = await startBattle(myEntry, opponent);
        setBattleState(prev => ({ ...prev, isSearching: false }));
        
        return battleResult;
      } else if (battleState.isSearching) {
        // Keep searching
        setTimeout(() => checkForOpponents(), 5000);
      }
    } catch (error) {
      console.error('Error checking for opponents:', error);
    }
  }, [walletAddress, battleState.isSearching, saveBattleQueue]);

  // Start battle between two players
  const startBattle = useCallback(async (player1, player2) => {
    try {
      console.log(`⚔️ Battle starting: ${player1.petName} (Lv.${player1.level}) vs ${player2.petName} (Lv.${player2.level})`);

      // Calculate win probabilities
      const player1WinRate = calculateWinProbability(player1.level, player2.level);
      const player2WinRate = 1 - player1WinRate;

      console.log(`📊 Win rates: ${player1.petName} ${(player1WinRate * 100).toFixed(1)}% vs ${player2.petName} ${(player2WinRate * 100).toFixed(1)}%`);

      // Simulate battle
      const battleRoll = Math.random();
      const isPlayer1Winner = battleRoll < player1WinRate;
      const winner = isPlayer1Winner ? player1 : player2;
      const loser = isPlayer1Winner ? player2 : player1;

      // Create battle record
      const battleRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        player1: {
          ...player1,
          isWinner: isPlayer1Winner,
          winProbability: player1WinRate
        },
        player2: {
          ...player2,
          isWinner: !isPlayer1Winner,
          winProbability: player2WinRate
        },
        winner: winner.walletAddress,
        battleRoll,
        ethStake: BATTLE_COST,
        ethReward: WINNER_REWARD,
        battleType: '1v1'
      };

      // Save battle to both players' histories
      saveBattleToHistory(player1.walletAddress, battleRecord);
      saveBattleToHistory(player2.walletAddress, battleRecord);

      // Update current battle state
      setBattleState(prev => ({ 
        ...prev, 
        currentBattle: battleRecord,
        isSearching: false
      }));

      console.log(`🏆 Battle result: ${winner.petName} wins! Reward: ${WINNER_REWARD} ETH`);

      return {
        success: true,
        battle: battleRecord,
        isWinner: winner.walletAddress === walletAddress,
        winnerName: winner.petName,
        loserName: loser.petName,
        ethReward: winner.walletAddress === walletAddress ? WINNER_REWARD : 0,
        message: winner.walletAddress === walletAddress ? 
          `🏆 Victory! You won ${WINNER_REWARD} ETH!` : 
          `💀 Defeat! You lost ${BATTLE_COST} ETH.`
      };

    } catch (error) {
      console.error('Battle execution failed:', error);
      return { success: false, error: error.message };
    }
  }, [walletAddress, calculateWinProbability]);

  // Save battle to player's history
  const saveBattleToHistory = useCallback((playerWallet, battle) => {
    try {
      const historyKey = `battle_history_${playerWallet}`;
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      existingHistory.unshift(battle); // Add to beginning
      
      // Keep only last 50 battles
      if (existingHistory.length > 50) {
        existingHistory.splice(50);
      }
      
      localStorage.setItem(historyKey, JSON.stringify(existingHistory));

      // Update state if this is current player
      if (playerWallet === walletAddress) {
        setBattleState(prev => ({ 
          ...prev, 
          battleHistory: existingHistory 
        }));
      }
    } catch (error) {
      console.error('Failed to save battle history:', error);
    }
  }, [walletAddress]);

  // Leave battle queue
  const leaveBattleQueue = useCallback(() => {
    try {
      const currentQueue = [...battleState.queuedPlayers];
      const updatedQueue = currentQueue.filter(p => p.walletAddress !== walletAddress);
      saveBattleQueue(updatedQueue);
      
      setBattleState(prev => ({ 
        ...prev, 
        isSearching: false, 
        error: null 
      }));

      console.log('❌ Left battle queue');
      return { success: true };
    } catch (error) {
      console.error('Failed to leave queue:', error);
      return { success: false, error: error.message };
    }
  }, [walletAddress, battleState.queuedPlayers, saveBattleQueue]);

  // Get player's battle stats
  const getBattleStats = useCallback(() => {
    const battles = battleState.battleHistory;
    const totalBattles = battles.length;
    const wins = battles.filter(b => b.winner === walletAddress).length;
    const losses = totalBattles - wins;
    const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;
    
    const totalEthWon = wins * WINNER_REWARD;
    const totalEthLost = losses * BATTLE_COST;
    const netEthGain = totalEthWon - totalEthLost - (wins * BATTLE_COST); // Subtract own stakes

    const petInfo = typeof currentPet === 'function' ? currentPet() : currentPet;

    return {
      totalBattles,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      totalEthWon,
      totalEthLost,
      netEthGain: Math.round(netEthGain * 10000) / 10000,
      currentLevel: petInfo?.level || 1
    };
  }, [battleState.battleHistory, walletAddress, currentPet]);

  // Clear current battle
  const clearCurrentBattle = useCallback(() => {
    setBattleState(prev => ({ ...prev, currentBattle: null }));
  }, []);

  return {
    // State
    isSearching: battleState.isSearching,
    currentBattle: battleState.currentBattle,
    battleHistory: battleState.battleHistory,
    queuedPlayers: battleState.queuedPlayers,
    isLoading: battleState.isLoading,
    error: battleState.error,

    // Actions
    joinBattleQueue,
    leaveBattleQueue,
    clearCurrentBattle,

    // Utils
    calculateWinProbability,
    getBattleStats,

    // Constants
    BATTLE_COST,
    WINNER_REWARD
  };
};