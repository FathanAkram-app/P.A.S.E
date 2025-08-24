import { useState, useEffect, useCallback } from 'react';

// Enhanced storage system that works with immutable NFTs
export const usePetStatsStorage = (walletAddress, currentNFTId) => {
  // Generate unique storage key for this pet
  const getStorageKey = useCallback((nftId = null) => {
    const petId = nftId || currentNFTId;
    if (walletAddress && petId) {
      return `pet_stats_${walletAddress}_${petId}`;
    }
    return 'pet_stats_default';
  }, [walletAddress, currentNFTId]);

  // Save stats to localStorage with NFT association
  const saveStats = useCallback(async (stats) => {
    try {
      const storageKey = getStorageKey();
      console.log(`💾 Saving stats to: ${storageKey}`);
      
      const dataToSave = {
        ...stats,
        walletAddress,
        nftId: currentNFTId,
        lastSaved: Date.now(),
        version: '1.0'
      };

      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      
      // Also save to general wallet storage for backup
      if (walletAddress) {
        const walletStats = JSON.parse(localStorage.getItem(`wallet_stats_${walletAddress}`) || '{}');
        walletStats[currentNFTId || 'default'] = dataToSave;
        localStorage.setItem(`wallet_stats_${walletAddress}`, JSON.stringify(walletStats));
      }
      
      console.log('✅ Stats saved successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to save stats:', error);
      return { success: false, error: error.message };
    }
  }, [walletAddress, currentNFTId, getStorageKey]);

  // Load stats from localStorage with NFT association
  const loadStats = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      console.log(`📊 Loading stats from: ${storageKey}`);
      
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('✅ Stats loaded successfully:', parsed);
        return { success: true, stats: parsed };
      }
      
      // Fallback: try to load from wallet storage
      if (walletAddress && currentNFTId) {
        const walletStats = JSON.parse(localStorage.getItem(`wallet_stats_${walletAddress}`) || '{}');
        if (walletStats[currentNFTId]) {
          console.log('📊 Loaded from wallet backup:', walletStats[currentNFTId]);
          return { success: true, stats: walletStats[currentNFTId] };
        }
      }
      
      console.log('ℹ️ No saved stats found');
      return { success: false, error: 'No saved stats found' };
    } catch (error) {
      console.error('❌ Failed to load stats:', error);
      return { success: false, error: error.message };
    }
  }, [walletAddress, currentNFTId, getStorageKey]);

  // Get all pets for a wallet
  const getAllPetsForWallet = useCallback((wallet) => {
    try {
      if (!wallet) return {};
      
      const walletStats = localStorage.getItem(`wallet_stats_${wallet}`);
      if (walletStats) {
        return JSON.parse(walletStats);
      }
      return {};
    } catch (error) {
      console.error('Failed to get wallet pets:', error);
      return {};
    }
  }, []);

  // Clear stats for current pet
  const clearStats = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      
      // Also remove from wallet storage
      if (walletAddress && currentNFTId) {
        const walletStats = JSON.parse(localStorage.getItem(`wallet_stats_${walletAddress}`) || '{}');
        delete walletStats[currentNFTId];
        localStorage.setItem(`wallet_stats_${walletAddress}`, JSON.stringify(walletStats));
      }
      
      console.log('🗑️ Stats cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to clear stats:', error);
      return { success: false, error: error.message };
    }
  }, [walletAddress, currentNFTId, getStorageKey]);

  // Export stats for backup
  const exportStats = useCallback(() => {
    try {
      const result = loadStats();
      if (result.success) {
        const exportData = {
          ...result.stats,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        
        return {
          success: true,
          data: exportData,
          json: JSON.stringify(exportData, null, 2)
        };
      }
      return { success: false, error: 'No stats to export' };
    } catch (error) {
      console.error('❌ Failed to export stats:', error);
      return { success: false, error: error.message };
    }
  }, [loadStats]);

  // Import stats from backup
  const importStats = useCallback(async (importData) => {
    try {
      const result = await saveStats(importData);
      return result;
    } catch (error) {
      console.error('❌ Failed to import stats:', error);
      return { success: false, error: error.message };
    }
  }, [saveStats]);

  return {
    saveStats,
    loadStats,
    getAllPetsForWallet,
    clearStats,
    exportStats,
    importStats,
    currentStorageKey: getStorageKey()
  };
};