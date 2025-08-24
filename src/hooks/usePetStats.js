import { useState, useEffect, useCallback } from 'react';
import { usePetStatsStorage } from './usePetStatsStorage';

export const usePetStats = (nftData = null, updateNFTMetadata = null, walletAddress = null) => {
  // Get current NFT ID for storage
  const currentNFTId = nftData?.tokenId || 'default';
  
  // Initialize storage system
  const { saveStats, loadStats } = usePetStatsStorage(walletAddress, currentNFTId);
  
  // Initialize pet stats with default values
  const [petStats, setPetStats] = useState({
    hunger: 80,
    happiness: 70,
    energy: 75,
    health: 100,
    experience: 0,
    level: 1,
    lastFed: null,
    lastPlayed: null,
    lastSlept: null,
    createdAt: Date.now(),
    age: 0, // Age in days
    lifeStage: 'baby', // baby, child, teen, adult, elder
    isDead: false,
    deathCause: null,
    evolutionStage: 1, // 1-5 evolution stages
    totalInteractions: 0,
    achievements: []
  });

  // Load stats when NFT or wallet changes
  useEffect(() => {
    const loadPetStats = () => {
      console.log(`📊 Loading stats for NFT: ${currentNFTId}, Wallet: ${walletAddress}`);
      
      // Try to load from our enhanced storage first
      const result = loadStats();
      if (result.success && result.stats) {
        console.log('✅ Stats loaded from storage:', result.stats);
        setPetStats(prev => ({
          ...prev,
          ...result.stats,
          // Ensure these are properly converted from stored values
          lastFed: result.stats.lastFed ? new Date(result.stats.lastFed) : null,
          lastPlayed: result.stats.lastPlayed ? new Date(result.stats.lastPlayed) : null,
          lastSlept: result.stats.lastSlept ? new Date(result.stats.lastSlept) : null,
          createdAt: result.stats.createdAt || Date.now()
        }));
        return;
      }
      
      // Fallback: try to load from NFT metadata (for existing saves)
      if (nftData?.metadata?.stats) {
        console.log('📊 Loading stats from NFT metadata:', nftData.metadata.stats);
        setPetStats(prev => ({
          ...prev,
          ...nftData.metadata.stats,
          lastFed: nftData.metadata.stats.lastFed ? new Date(nftData.metadata.stats.lastFed) : null,
          lastPlayed: nftData.metadata.stats.lastPlayed ? new Date(nftData.metadata.stats.lastPlayed) : null,
          lastSlept: nftData.metadata.stats.lastSlept ? new Date(nftData.metadata.stats.lastSlept) : null,
          createdAt: nftData.metadata.stats.createdAt || Date.now()
        }));
        return;
      }
      
      console.log('ℹ️ No saved stats found, using defaults');
    };

    loadPetStats();
  }, [nftData, currentNFTId, walletAddress, loadStats]);

  // Save stats whenever they change
  useEffect(() => {
    const performSave = async () => {
      try {
        // Create a clean object without any potential circular references
        const cleanStats = {
          hunger: petStats.hunger,
          happiness: petStats.happiness,
          energy: petStats.energy,
          health: petStats.health,
          experience: petStats.experience,
          level: petStats.level,
          lastFed: petStats.lastFed,
          lastPlayed: petStats.lastPlayed,
          lastSlept: petStats.lastSlept,
          createdAt: petStats.createdAt,
          age: petStats.age,
          lifeStage: petStats.lifeStage,
          isDead: petStats.isDead,
          deathCause: petStats.deathCause,
          evolutionStage: petStats.evolutionStage,
          totalInteractions: petStats.totalInteractions,
          achievements: petStats.achievements
        };

        // Save using our enhanced storage system
        console.log(`💾 Saving stats for NFT: ${currentNFTId}`);
        const result = await saveStats(cleanStats);
        
        if (result.success) {
          console.log('✅ Stats saved successfully');
        } else {
          console.error('❌ Failed to save stats:', result.error);
        }
        
      } catch (error) {
        console.warn('Failed to save pet stats:', error);
      }
    };

    // Debounce saves to avoid too frequent saves
    const timeoutId = setTimeout(performSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [petStats, currentNFTId, saveStats]);

  // Calculate level from experience
  useEffect(() => {
    const newLevel = Math.floor(petStats.experience / 100) + 1;
    if (newLevel !== petStats.level) {
      setPetStats(prev => ({
        ...prev,
        level: newLevel
      }));
    }
  }, [petStats.experience, petStats.level]);

  // Auto-decrease stats over time (hunger and energy)
  useEffect(() => {
    const gameInterval = setInterval(() => {
      setPetStats(prev => {
        if (prev.isDead) return prev; // Don't decay if dead
        
        const now = Date.now();
        const timeSinceLastUpdate = prev.lastUpdate ? now - prev.lastUpdate : 30000;
        const minutesPassed = Math.min(timeSinceLastUpdate / (1000 * 60), 30); // Cap at 30 minutes
        
        // Natural stat decay over time
        const hungerDecay = Math.min(prev.hunger, minutesPassed * 0.8);
        const energyDecay = Math.min(prev.energy, minutesPassed * 0.6);
        const happinessDecay = Math.min(prev.happiness, minutesPassed * 0.4);
        
        const newStats = {
          ...prev,
          hunger: Math.max(0, prev.hunger - hungerDecay),
          energy: Math.max(0, prev.energy - energyDecay),
          happiness: Math.max(0, prev.happiness - happinessDecay),
          lastUpdate: now
        };

        // Check for death conditions
        if (newStats.health <= 0 && !newStats.isDead) {
          newStats.isDead = true;
          newStats.deathCause = 'neglect';
        } else if ((newStats.hunger <= 0 || newStats.energy <= 0) && !newStats.isDead) {
          newStats.health = Math.max(0, newStats.health - 5);
        }

        return newStats;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(gameInterval);
  }, []);

  // Update pet stats
  const updateStats = useCallback((updates) => {
    console.log('📊 updateStats called with:', updates);
    setPetStats(prev => {
      const newStats = { ...prev };
      
      Object.keys(updates).forEach(key => {
        if (key in newStats) {
          // Clamp values between 0 and 100 for percentage stats
          if (['hunger', 'happiness', 'energy', 'health'].includes(key)) {
            newStats[key] = Math.max(0, Math.min(100, updates[key]));
          } else {
            newStats[key] = updates[key];
          }
        }
      });

      // Update timestamps for certain actions
      const now = Date.now();
      if (updates.hunger && updates.hunger > prev.hunger) {
        newStats.lastFed = now;
      }
      if (updates.happiness && updates.happiness > prev.happiness) {
        newStats.lastPlayed = now;
      }
      if (updates.energy && updates.energy > prev.energy) {
        newStats.lastSlept = now;
      }

      console.log('📊 Stats updated:', newStats);
      return newStats;
    });
  }, []);

  // Achievement system
  const checkAchievements = useCallback((newStats) => {
    const achievements = [...newStats.achievements];
    const newAchievements = [];
    
    // Level achievements
    if (newStats.level >= 10 && !achievements.includes('cosmic_master')) {
      achievements.push('cosmic_master');
      newAchievements.push({ id: 'cosmic_master', title: '🌟 Cosmic Master', description: 'Reached level 10!' });
    }
    
    if (newStats.level >= 5 && !achievements.includes('space_explorer')) {
      achievements.push('space_explorer');
      newAchievements.push({ id: 'space_explorer', title: '🚀 Space Explorer', description: 'Reached level 5!' });
    }
    
    // Interaction achievements
    if (newStats.totalInteractions >= 100 && !achievements.includes('devoted_caretaker')) {
      achievements.push('devoted_caretaker');
      newAchievements.push({ id: 'devoted_caretaker', title: '❤️ Devoted Caretaker', description: '100 interactions!' });
    }
    
    // Stat achievements
    if (newStats.happiness >= 95 && !achievements.includes('pure_joy')) {
      achievements.push('pure_joy');
      newAchievements.push({ id: 'pure_joy', title: '😄 Pure Joy', description: 'Maximum happiness!' });
    }

    return newAchievements;
  }, []);

  // Feed the pet
  const feedPet = useCallback(() => {
    console.log('🍎 feedPet called');
    const result = { success: true, message: '', achievements: [] };
    
    setPetStats(prev => {
      if (prev.isDead) {
        result.message = "Your pet needs to be revived first!";
        result.success = false;
        return prev;
      }

      const hungerIncrease = Math.min(25 + Math.random() * 15, 100 - prev.hunger);
      const happinessIncrease = Math.min(10 + Math.random() * 10, 100 - prev.happiness);
      const experienceGain = 5;

      const newStats = {
        ...prev,
        hunger: Math.min(100, prev.hunger + hungerIncrease),
        happiness: Math.min(100, prev.happiness + happinessIncrease),
        experience: prev.experience + experienceGain,
        lastFed: Date.now(),
        totalInteractions: prev.totalInteractions + 1
      };

      // Check for level up
      const newLevel = Math.floor(newStats.experience / 100) + 1;
      if (newLevel > prev.level) {
        newStats.level = newLevel;
        result.message = `Yum! Level up to ${newLevel}! 🌟`;
      } else {
        result.message = `Nom nom! Hunger +${Math.round(hungerIncrease)} ✨`;
      }

      // Check achievements
      const achievements = checkAchievements(newStats);
      result.achievements = achievements;

      console.log('🍎 Feed result - New stats:', newStats);
      return newStats;
    });

    return result;
  }, [checkAchievements]);

  // Play with the pet
  const playWithPet = useCallback(() => {
    console.log('🎾 playWithPet called');
    const result = { success: true, message: '', achievements: [] };
    
    setPetStats(prev => {
      if (prev.isDead) {
        result.message = "Your pet needs to be revived first!";
        result.success = false;
        return prev;
      }

      if (prev.energy < 10) {
        result.message = "Your pet is too tired to play! 😴";
        result.success = false;
        return prev;
      }

      const happinessIncrease = Math.min(20 + Math.random() * 20, 100 - prev.happiness);
      const energyDecrease = 10 + Math.random() * 10;
      const experienceGain = 8;

      const newStats = {
        ...prev,
        happiness: Math.min(100, prev.happiness + happinessIncrease),
        energy: Math.max(0, prev.energy - energyDecrease),
        experience: prev.experience + experienceGain,
        lastPlayed: Date.now(),
        totalInteractions: prev.totalInteractions + 1
      };

      // Check for level up
      const newLevel = Math.floor(newStats.experience / 100) + 1;
      if (newLevel > prev.level) {
        newStats.level = newLevel;
        result.message = `So much fun! Level up to ${newLevel}! 🌟`;
      } else {
        result.message = `Wheee! Happiness +${Math.round(happinessIncrease)} 🎾`;
      }

      // Check achievements
      const achievements = checkAchievements(newStats);
      result.achievements = achievements;

      console.log('🎾 Play result - New stats:', newStats);
      return newStats;
    });

    return result;
  }, [checkAchievements]);

  // Let pet sleep
  const letPetSleep = useCallback(() => {
    console.log('💤 letPetSleep called');
    const result = { success: true, message: '', achievements: [] };
    
    setPetStats(prev => {
      if (prev.isDead) {
        result.message = "Your pet needs to be revived first!";
        result.success = false;
        return prev;
      }

      const energyIncrease = Math.min(30 + Math.random() * 20, 100 - prev.energy);
      const healthIncrease = Math.min(5 + Math.random() * 5, 100 - prev.health);
      const experienceGain = 3;

      const newStats = {
        ...prev,
        energy: Math.min(100, prev.energy + energyIncrease),
        health: Math.min(100, prev.health + healthIncrease),
        experience: prev.experience + experienceGain,
        lastSlept: Date.now(),
        totalInteractions: prev.totalInteractions + 1
      };

      // Check for level up
      const newLevel = Math.floor(newStats.experience / 100) + 1;
      if (newLevel > prev.level) {
        newStats.level = newLevel;
        result.message = `Sweet dreams! Level up to ${newLevel}! 🌟`;
      } else {
        result.message = `Zzz... Energy +${Math.round(energyIncrease)} 💤`;
      }

      // Check achievements
      const achievements = checkAchievements(newStats);
      result.achievements = achievements;

      console.log('💤 Sleep result - New stats:', newStats);
      return newStats;
    });

    return result;
  }, [checkAchievements]);

  // Pet the pet
  const petPet = useCallback(() => {
    console.log('❤️ petPet called');
    const result = { success: true, message: '', achievements: [] };
    
    setPetStats(prev => {
      if (prev.isDead) {
        result.message = "Your pet needs to be revived first!";
        result.success = false;
        return prev;
      }

      const happinessIncrease = Math.min(15 + Math.random() * 10, 100 - prev.happiness);
      const healthIncrease = Math.min(3 + Math.random() * 3, 100 - prev.health);
      const experienceGain = 4;

      const newStats = {
        ...prev,
        happiness: Math.min(100, prev.happiness + happinessIncrease),
        health: Math.min(100, prev.health + healthIncrease),
        experience: prev.experience + experienceGain,
        totalInteractions: prev.totalInteractions + 1
      };

      // Check for level up
      const newLevel = Math.floor(newStats.experience / 100) + 1;
      if (newLevel > prev.level) {
        newStats.level = newLevel;
        result.message = `Such love! Level up to ${newLevel}! 🌟`;
      } else {
        result.message = `*purrs* Happiness +${Math.round(happinessIncrease)} ❤️`;
      }

      // Check achievements
      const achievements = checkAchievements(newStats);
      result.achievements = achievements;

      console.log('❤️ Pet result - New stats:', newStats);
      return newStats;
    });

    return result;
  }, [checkAchievements]);

  // Revive pet
  const revivePet = useCallback(() => {
    console.log('🌟 revivePet called');
    const result = { success: true, message: 'Your pet has been revived! 🌟', achievements: [] };
    
    setPetStats(prev => ({
      ...prev,
      isDead: false,
      deathCause: null,
      health: 50,
      hunger: 30,
      energy: 40,
      happiness: 25,
      totalInteractions: prev.totalInteractions + 1
    }));

    return result;
  }, []);

  // Play mini game
  const playMiniGame = useCallback(() => {
    console.log('🎮 playMiniGame called');
    const result = { success: true, message: '', achievements: [] };
    
    setPetStats(prev => {
      if (prev.isDead) {
        result.message = "Your pet needs to be revived first!";
        result.success = false;
        return prev;
      }

      const performance = Math.random(); // 0-1 performance score
      const experienceGain = Math.floor(15 + performance * 15);
      const happinessIncrease = Math.floor(10 + performance * 15);

      const newStats = {
        ...prev,
        experience: prev.experience + experienceGain,
        happiness: Math.min(100, prev.happiness + happinessIncrease),
        totalInteractions: prev.totalInteractions + 1
      };

      result.message = `Mini-game complete! +${experienceGain} XP! 🎮`;

      // Check achievements
      const achievements = checkAchievements(newStats);
      result.achievements = achievements;

      return newStats;
    });

    return result;
  }, [checkAchievements]);

  // Reset stats (for testing)
  const resetStats = useCallback(() => {
    console.log('🔄 resetStats called');
    setPetStats({
      hunger: 80,
      happiness: 70,
      energy: 75,
      health: 100,
      experience: 0,
      level: 1,
      lastFed: null,
      lastPlayed: null,
      lastSlept: null,
      createdAt: Date.now(),
      age: 0,
      lifeStage: 'baby',
      isDead: false,
      deathCause: null,
      evolutionStage: 1,
      totalInteractions: 0,
      achievements: []
    });
  }, []);

  // Get pet mood based on stats
  const getPetMood = useCallback(() => {
    if (petStats.isDead) return 'dead';
    if (petStats.happiness > 80) return 'ecstatic';
    if (petStats.happiness > 60) return 'happy';
    if (petStats.happiness > 40) return 'content';
    if (petStats.happiness > 20) return 'sad';
    return 'depressed';
  }, [petStats.isDead, petStats.happiness]);

  // Get care priority
  const getCarePriority = useCallback(() => {
    if (petStats.isDead) return 'revive';
    if (petStats.health < 20) return 'health';
    if (petStats.hunger < 20) return 'food';
    if (petStats.energy < 20) return 'sleep';
    if (petStats.happiness < 20) return 'play';
    return 'none';
  }, [petStats]);

  return {
    petStats,
    updateStats,
    feedPet,
    playWithPet,
    letPetSleep,
    petPet,
    revivePet,
    playMiniGame,
    resetStats,
    getPetMood,
    getCarePriority,
    checkAchievements
  };
};