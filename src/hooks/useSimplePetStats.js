import { useState, useEffect, useCallback } from 'react';

// Simple, synchronized pet stats system
export const useSimplePetStats = (petId = 'default') => {
  // Single source of truth for all pet stats
  const [stats, setStats] = useState({
    hunger: 80,
    happiness: 70,
    energy: 75,
    health: 100,
    level: 1,
    experience: 0,
    totalInteractions: 0,
    lastInteraction: null,
    isAlive: true,
    createdAt: Date.now()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Storage key for this specific pet
  const storageKey = `pet_${petId}`;

  // Load stats on mount
  useEffect(() => {
    const loadStats = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log(`📊 Loaded stats for pet ${petId}:`, parsed);
          setStats(parsed);
          setLastSaved(new Date(parsed.lastSaved || Date.now()));
        } else {
          console.log(`📊 No saved stats for pet ${petId}, using defaults`);
          // Save initial stats
          saveStatsToStorage({
            ...stats,
            createdAt: Date.now()
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, [petId, storageKey]); // Only reload when petId changes

  // Save stats to storage
  const saveStatsToStorage = useCallback((statsToSave) => {
    try {
      const dataToSave = {
        ...statsToSave,
        lastSaved: Date.now(),
        petId: petId
      };
      
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      setLastSaved(new Date());
      console.log(`💾 Stats saved for pet ${petId}`);
      return true;
    } catch (error) {
      console.error('Failed to save stats:', error);
      return false;
    }
  }, [petId, storageKey]);

  // Auto-save whenever stats change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveStatsToStorage(stats);
    }, 500); // Save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [stats, saveStatsToStorage]);

  // Update specific stat values
  const updateStats = useCallback((updates) => {
    console.log(`📈 Updating stats for pet ${petId}:`, updates);
    
    setStats(prev => {
      const newStats = { ...prev };
      
      // Apply updates
      Object.keys(updates).forEach(key => {
        if (key in newStats) {
          // Clamp percentage stats between 0-100
          if (['hunger', 'happiness', 'energy', 'health'].includes(key)) {
            newStats[key] = Math.max(0, Math.min(100, updates[key]));
          } else {
            newStats[key] = updates[key];
          }
        }
      });

      // Auto-calculate level from experience
      const newLevel = Math.floor(newStats.experience / 100) + 1;
      if (newLevel !== newStats.level) {
        newStats.level = newLevel;
        console.log(`🌟 Pet ${petId} leveled up to ${newLevel}!`);
      }

      // Check if pet should die
      if (newStats.health <= 0 && newStats.isAlive) {
        newStats.isAlive = false;
        console.log(`💀 Pet ${petId} has died`);
      }

      // Update interaction tracking
      if (Object.keys(updates).some(key => ['hunger', 'happiness', 'energy'].includes(key))) {
        newStats.lastInteraction = Date.now();
        newStats.totalInteractions = (newStats.totalInteractions || 0) + 1;
      }

      return newStats;
    });
  }, [petId]);

  // Simple action functions
  const feed = useCallback(() => {
    if (!stats.isAlive) {
      return { success: false, message: "Pet needs to be revived first!" };
    }

    const hungerGain = Math.min(30, 100 - stats.hunger);
    const happinessGain = Math.min(10, 100 - stats.happiness);
    
    updateStats({
      hunger: stats.hunger + hungerGain,
      happiness: stats.happiness + happinessGain,
      experience: stats.experience + 5
    });

    return { 
      success: true, 
      message: `Fed pet! Hunger +${Math.round(hungerGain)}` 
    };
  }, [stats, updateStats]);

  const play = useCallback(() => {
    if (!stats.isAlive) {
      return { success: false, message: "Pet needs to be revived first!" };
    }

    if (stats.energy < 15) {
      return { success: false, message: "Pet is too tired to play!" };
    }

    const happinessGain = Math.min(25, 100 - stats.happiness);
    const energyLoss = Math.min(15, stats.energy);
    
    updateStats({
      happiness: stats.happiness + happinessGain,
      energy: stats.energy - energyLoss,
      experience: stats.experience + 8
    });

    return { 
      success: true, 
      message: `Played with pet! Happiness +${Math.round(happinessGain)}` 
    };
  }, [stats, updateStats]);

  const sleep = useCallback(() => {
    if (!stats.isAlive) {
      return { success: false, message: "Pet needs to be revived first!" };
    }

    const energyGain = Math.min(40, 100 - stats.energy);
    const healthGain = Math.min(5, 100 - stats.health);
    
    updateStats({
      energy: stats.energy + energyGain,
      health: stats.health + healthGain,
      experience: stats.experience + 3
    });

    return { 
      success: true, 
      message: `Pet slept well! Energy +${Math.round(energyGain)}` 
    };
  }, [stats, updateStats]);

  const pet = useCallback(() => {
    if (!stats.isAlive) {
      return { success: false, message: "Pet needs to be revived first!" };
    }

    const happinessGain = Math.min(15, 100 - stats.happiness);
    const healthGain = Math.min(3, 100 - stats.health);
    
    updateStats({
      happiness: stats.happiness + happinessGain,
      health: stats.health + healthGain,
      experience: stats.experience + 4
    });

    return { 
      success: true, 
      message: `Petted! Happiness +${Math.round(happinessGain)}` 
    };
  }, [stats, updateStats]);

  const revive = useCallback(() => {
    if (stats.isAlive) {
      return { success: false, message: "Pet is already alive!" };
    }

    updateStats({
      isAlive: true,
      health: 50,
      hunger: 30,
      energy: 40,
      happiness: 25
    });

    return { success: true, message: "Pet has been revived! 🌟" };
  }, [stats, updateStats]);

  // Reset stats (for testing)
  const resetStats = useCallback(() => {
    const newStats = {
      hunger: 80,
      happiness: 70,
      energy: 75,
      health: 100,
      level: 1,
      experience: 0,
      totalInteractions: 0,
      lastInteraction: null,
      isAlive: true,
      createdAt: Date.now()
    };
    
    setStats(newStats);
    saveStatsToStorage(newStats);
    console.log(`🔄 Reset stats for pet ${petId}`);
  }, [petId, saveStatsToStorage]);

  // Debug kill function (for testing)
  const killPet = useCallback(() => {
    if (!stats.isAlive) {
      return { success: false, message: "Pet is already dead!" };
    }

    updateStats({
      isAlive: false,
      health: 0
    });

    return { success: true, message: "Pet has been killed for testing! 💀" };
  }, [stats, updateStats]);

  // Auto-decay stats over time
  useEffect(() => {
    if (!stats.isAlive) return;

    const interval = setInterval(() => {
      updateStats({
        hunger: Math.max(0, stats.hunger - 1),
        energy: Math.max(0, stats.energy - 0.5),
        happiness: Math.max(0, stats.happiness - 0.3),
        health: stats.hunger <= 0 || stats.energy <= 0 ? Math.max(0, stats.health - 2) : stats.health
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [stats, updateStats]);

  return {
    stats,
    lastSaved,
    isLoading,
    updateStats,
    feed,
    play,
    sleep,
    pet,
    revive,
    resetStats,
    killPet
  };
};