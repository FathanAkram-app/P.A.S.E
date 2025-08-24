import { useEffect } from 'react';
import { useSimpleNFT } from './useSimpleNFT';
import { useSimplePetStats } from './useSimplePetStats';
import { useBattleSystem } from './useBattleSystem';

// Unified controller that keeps NFT and stats synchronized
export const usePetController = (walletAddress) => {
  // NFT system (cosmetic/static traits only)
  const {
    currentNFT,
    ownedNFTs,
    isLoading: isNFTLoading,
    isMinting,
    error: nftError,
    mintNFT,
    mintMarketplaceNFT,
    selectNFT,
    updateAliveStatus
  } = useSimpleNFT(walletAddress);

  // Stats system (dynamic game data)
  const {
    stats,
    lastSaved,
    isLoading: isStatsLoading,
    updateStats,
    feed,
    play,
    sleep,
    pet,
    revive,
    resetStats,
    killPet
  } = useSimplePetStats(currentNFT?.tokenId);

  // Get current pet info combining NFT traits and live stats
  const getCurrentPetInfo = () => {
    if (!currentNFT) return null;

    // Safely access nested properties with fallbacks
    const traits = currentNFT.metadata?.traits || {};
    const metadata = currentNFT.metadata || {};

    return {
      // Static NFT traits (with safe fallbacks)
      tokenId: currentNFT.tokenId || 'unknown',
      name: metadata.name || `P.A.S.E #${currentNFT.tokenId || 'Unknown'}`,
      image: metadata.image || '',
      species: traits.species || 'Space Entity',
      color: traits.color || 'Blue',
      personality: traits.personality || 'Friendly',
      rarity: traits.rarity || 'Common',
      specialTrait: traits.specialTrait || 'None',
      birthDate: traits.birthDate || new Date().toISOString(),
      
      // Dynamic stats with safe fallbacks
      hunger: stats.hunger || 80,
      happiness: stats.happiness || 70,
      energy: stats.energy || 75,
      health: stats.health || 100,
      level: stats.level || 1,
      experience: stats.experience || 0,
      totalInteractions: stats.totalInteractions || 0,
      isAlive: stats.isAlive !== undefined ? stats.isAlive : true,
      lastInteraction: stats.lastInteraction || null,
      createdAt: stats.createdAt || Date.now(),
      
      // Computed properties
      mood: getMood(stats || {}),
      carePriority: getCarePriority(stats || {})
    };
  };

  // Battle system - now can safely use getCurrentPetInfo
  const battleSystem = useBattleSystem(walletAddress, getCurrentPetInfo());

  // Synchronize alive status between stats and NFT traits
  useEffect(() => {
    if (currentNFT && currentNFT.metadata?.traits && stats) {
      const statsAlive = stats.isAlive !== undefined ? stats.isAlive : true;
      const nftAlive = currentNFT.metadata.traits.isAlive !== undefined ? currentNFT.metadata.traits.isAlive : true;
      
      if (statsAlive !== nftAlive) {
        console.log(`🔄 Syncing alive status: ${statsAlive}`);
        updateAliveStatus(currentNFT.tokenId, statsAlive);
      }
    }
  }, [currentNFT, stats, updateAliveStatus]);

  // Enhanced action functions that handle both stats and NFT sync
  const performFeed = async () => {
    const result = feed();
    console.log('🍎 Feed action:', result);
    return result;
  };

  const performPlay = async () => {
    const result = play();
    console.log('🎾 Play action:', result);
    return result;
  };

  const performSleep = async () => {
    const result = sleep();
    console.log('💤 Sleep action:', result);
    return result;
  };

  const performPet = async () => {
    const result = pet();
    console.log('❤️ Pet action:', result);
    return result;
  };

  const performRevive = async () => {
    const result = revive();
    if (result.success && currentNFT) {
      await updateAliveStatus(currentNFT.tokenId, true);
    }
    console.log('🌟 Revive action:', result);
    return result;
  };

  const performKill = async () => {
    const result = killPet();
    if (result.success && currentNFT) {
      await updateAliveStatus(currentNFT.tokenId, false);
    }
    console.log('💀 Kill action:', result);
    return result;
  };

  // Switch to a different pet
  const switchToPet = async (tokenId) => {
    console.log(`🔄 Switching to pet ${tokenId}`);
    const result = selectNFT(tokenId);
    return result;
  };

  // Create a new pet NFT (basic version with default stats)
  const createNewPet = async (cosmetics = {}) => {
    console.log('🎨 Creating new pet with cosmetics:', cosmetics);
    try {
      const result = await mintNFT(cosmetics);
      if (result.success) {
        // Stats will auto-initialize for the new pet
        console.log('✅ New pet created successfully');
      }
      return result;
    } catch (error) {
      console.error('❌ Failed to create pet:', error);
      throw error;
    }
  };

  // Create marketplace-ready NFT with current stats
  const createMarketplacePet = async (cosmetics = {}) => {
    console.log('🏪 Creating marketplace pet with current stats:', stats);
    try {
      const result = await mintMarketplaceNFT(stats, cosmetics);
      if (result.success) {
        console.log('✅ Marketplace pet created successfully with traits:', result.nft.metadata.traits);
      }
      return result;
    } catch (error) {
      console.error('❌ Failed to create marketplace pet:', error);
      throw error;
    }
  };

  // Create a fallback pet if no NFT exists (for testing)
  const getFallbackPet = () => ({
    tokenId: 'default',
    name: 'Default P.A.S.E',
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=default',
    species: 'Space Entity',
    color: 'Blue',
    personality: 'Friendly',
    rarity: 'Common',
    specialTrait: 'None',
    birthDate: new Date().toISOString(),
    // Safely spread stats with fallbacks
    hunger: stats.hunger || 80,
    happiness: stats.happiness || 70,
    energy: stats.energy || 75,
    health: stats.health || 100,
    level: stats.level || 1,
    experience: stats.experience || 0,
    totalInteractions: stats.totalInteractions || 0,
    isAlive: stats.isAlive !== undefined ? stats.isAlive : true,
    lastInteraction: stats.lastInteraction || null,
    createdAt: stats.createdAt || Date.now(),
    mood: getMood(stats || {}),
    carePriority: getCarePriority(stats || {})
  });

  return {
    // Current pet info (with fallback)
    currentPet: getCurrentPetInfo() || getFallbackPet(),
    ownedNFTs,
    
    // Loading states
    isLoading: isNFTLoading || isStatsLoading,
    isMinting,
    lastSaved,
    
    // Errors
    error: nftError,
    
    // Pet actions
    feed: performFeed,
    play: performPlay,
    sleep: performSleep,
    pet: performPet,
    revive: performRevive,
    killPet: performKill,
    
    // Pet management
    switchToPet,
    createNewPet,
    createMarketplacePet,
    resetStats,
    
    // Battle system
    battleSystem,
    
    // Direct access if needed
    stats,
    updateStats
  };
};

// Helper functions
const getMood = (stats = {}) => {
  if (stats.isAlive === false) return 'dead';
  const happiness = stats.happiness || 70;
  if (happiness > 80) return 'ecstatic';
  if (happiness > 60) return 'happy';
  if (happiness > 40) return 'content';
  if (happiness > 20) return 'sad';
  return 'depressed';
};

const getCarePriority = (stats = {}) => {
  if (stats.isAlive === false) return 'revive';
  if ((stats.health || 100) < 20) return 'health';
  if ((stats.hunger || 80) < 20) return 'food';
  if ((stats.energy || 75) < 20) return 'sleep';
  if ((stats.happiness || 70) < 20) return 'play';
  return 'none';
};