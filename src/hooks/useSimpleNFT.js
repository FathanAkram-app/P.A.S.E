import { useState, useEffect, useCallback } from 'react';

// Simplified NFT system - only handles static/cosmetic traits
export const useSimpleNFT = (walletAddress) => {
  const [nftState, setNftState] = useState({
    currentNFT: null,
    ownedNFTs: [],
    isLoading: false,
    isMinting: false,
    error: null
  });

  // Load NFTs when wallet connects
  useEffect(() => {
    if (walletAddress) {
      loadNFTs();
    } else {
      setNftState(prev => ({
        ...prev,
        currentNFT: null,
        ownedNFTs: []
      }));
    }
  }, [walletAddress]);

  // Load user's NFTs
  const loadNFTs = useCallback(async () => {
    if (!walletAddress) return;

    setNftState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load from localStorage (simulating blockchain)
      const savedNFTs = localStorage.getItem(`nfts_${walletAddress}`);
      const ownedNFTs = savedNFTs ? JSON.parse(savedNFTs) : [];
      
      setNftState(prev => ({
        ...prev,
        ownedNFTs,
        currentNFT: ownedNFTs.length > 0 ? ownedNFTs[0] : null,
        isLoading: false
      }));

      console.log(`📦 Loaded ${ownedNFTs.length} NFTs for wallet ${walletAddress}`);
    } catch (error) {
      console.error('Failed to load NFTs:', error);
      setNftState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  }, [walletAddress]);

  // Mint a new NFT with current stats for marketplace
  const mintNFT = useCallback(async (cosmetics = {}, currentStats = null) => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    setNftState(prev => ({ ...prev, isMinting: true, error: null }));

    try {
      // Generate new NFT with only static traits
      const tokenId = Date.now();
      const newNFT = {
        tokenId,
        owner: walletAddress,
        metadata: {
          name: `${cosmetics.species || 'Digital Pet'} #${tokenId}`,
          description: `A ${cosmetics.rarity || 'common'} ${cosmetics.species || 'digital pet'} with ${cosmetics.personality || 'friendly'} personality.`,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${tokenId}&backgroundColor=${getColorHex(cosmetics.color)}`,
          
          // NFT traits for marketplace (some static, some dynamic)
          traits: {
            // Static cosmetic traits (never change)
            species: cosmetics.species || 'Digital Pet',
            color: cosmetics.color || 'Blue', 
            personality: cosmetics.personality || 'Friendly',
            birthDate: new Date().toISOString(),
            generation: 1,
            
            // Dynamic traits that update when minting for marketplace
            level: currentStats?.level || 1, // Current pet level
            alive: currentStats?.isAlive !== false, // Current alive status
            rarity: calculateRarity(cosmetics, currentStats), // Based on traits and stats
            shine: calculateShine(cosmetics, currentStats) // Based on level and rarity
          }
        },
        mintedAt: new Date().toISOString(),
        createdAt: Date.now()
      };

      // Simulate minting delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to localStorage (simulating blockchain)
      const existingNFTs = JSON.parse(localStorage.getItem(`nfts_${walletAddress}`) || '[]');
      existingNFTs.unshift(newNFT);
      localStorage.setItem(`nfts_${walletAddress}`, JSON.stringify(existingNFTs));

      setNftState(prev => ({
        ...prev,
        ownedNFTs: existingNFTs,
        currentNFT: newNFT,
        isMinting: false
      }));

      console.log(`🎉 Minted new NFT #${tokenId}`);
      return { success: true, tokenId, nft: newNFT };

    } catch (error) {
      console.error('Minting failed:', error);
      setNftState(prev => ({
        ...prev,
        isMinting: false,
        error: error.message
      }));
      throw error;
    }
  }, [walletAddress]);

  // Select a different NFT as current
  const selectNFT = useCallback((tokenId) => {
    const nft = nftState.ownedNFTs.find(n => n.tokenId === tokenId);
    if (nft) {
      setNftState(prev => ({
        ...prev,
        currentNFT: nft
      }));
      console.log(`🎯 Selected NFT #${tokenId}`);
      return { success: true };
    }
    return { success: false, error: 'NFT not found' };
  }, [nftState.ownedNFTs]);

  // Update dynamic traits (alive status when pet dies/revives)
  const updateAliveStatus = useCallback(async (tokenId, isAlive) => {
    try {
      const existingNFTs = JSON.parse(localStorage.getItem(`nfts_${walletAddress}`) || '[]');
      const nftIndex = existingNFTs.findIndex(nft => nft.tokenId === tokenId);
      
      if (nftIndex !== -1) {
        existingNFTs[nftIndex].metadata.traits.alive = isAlive;
        localStorage.setItem(`nfts_${walletAddress}`, JSON.stringify(existingNFTs));
        
        // Update state if this is the current NFT
        if (nftState.currentNFT?.tokenId === tokenId) {
          setNftState(prev => ({
            ...prev,
            currentNFT: existingNFTs[nftIndex],
            ownedNFTs: existingNFTs
          }));
        }
        
        console.log(`💫 Updated alive status for NFT #${tokenId}: ${isAlive}`);
        return { success: true };
      }
      return { success: false, error: 'NFT not found' };
    } catch (error) {
      console.error('Failed to update alive status:', error);
      return { success: false, error: error.message };
    }
  }, [walletAddress, nftState.currentNFT]);

  // Mint marketplace-ready NFT with current stats
  const mintMarketplaceNFT = useCallback(async (currentStats, cosmetics = {}) => {
    console.log('🏪 Minting marketplace NFT with current stats:', currentStats);
    return await mintNFT(cosmetics, currentStats);
  }, [mintNFT]);

  return {
    currentNFT: nftState.currentNFT,
    ownedNFTs: nftState.ownedNFTs,
    isLoading: nftState.isLoading,
    isMinting: nftState.isMinting,
    error: nftState.error,
    mintNFT,
    mintMarketplaceNFT,
    selectNFT,
    updateAliveStatus,
    loadNFTs
  };
};

// Helper function for colors
const getColorHex = (colorName) => {
  const colorMap = {
    blue: '3B82F6',
    green: '10B981', 
    pink: 'F472B6',
    purple: '8B5CF6',
    golden: 'F59E0B',
    silver: '6B7280'
  };
  return colorMap[colorName] || '3B82F6';
};

// Calculate rarity based on traits and stats
const calculateRarity = (cosmetics, stats) => {
  let rarityScore = 0;
  
  // Base rarity from cosmetics
  if (cosmetics.specialTrait && cosmetics.specialTrait !== 'None') rarityScore += 20;
  if (cosmetics.color === 'golden') rarityScore += 15;
  if (cosmetics.color === 'silver') rarityScore += 10;
  if (cosmetics.personality === 'Legendary') rarityScore += 25;
  
  // Stats-based rarity
  if (stats?.level >= 20) rarityScore += 30; // High level
  if (stats?.level >= 10) rarityScore += 15; // Medium level
  if (stats?.experience >= 2000) rarityScore += 20; // Lots of experience
  if (stats?.totalInteractions >= 500) rarityScore += 15; // Well-cared for
  
  // Determine rarity tier
  if (rarityScore >= 60) return 'Legendary';
  if (rarityScore >= 40) return 'Epic';
  if (rarityScore >= 20) return 'Rare';
  if (rarityScore >= 10) return 'Uncommon';
  return 'Common';
};

// Calculate shine based on level and rarity
const calculateShine = (cosmetics, stats) => {
  let shineScore = 0;
  
  // Level-based shine
  if (stats?.level >= 25) shineScore += 50; // Max level pets shine bright
  else if (stats?.level >= 15) shineScore += 30;
  else if (stats?.level >= 10) shineScore += 20;
  else if (stats?.level >= 5) shineScore += 10;
  
  // Health and happiness contribute to shine
  if (stats?.health >= 95) shineScore += 15;
  if (stats?.happiness >= 95) shineScore += 15;
  
  // Perfect stats bonus
  if (stats?.health >= 95 && stats?.happiness >= 95 && stats?.energy >= 95) {
    shineScore += 25; // Perfect condition bonus
  }
  
  // Rarity contributes to shine
  const rarity = calculateRarity(cosmetics, stats);
  switch (rarity) {
    case 'Legendary': shineScore += 40; break;
    case 'Epic': shineScore += 25; break;
    case 'Rare': shineScore += 15; break;
    case 'Uncommon': shineScore += 5; break;
    default: break;
  }
  
  // Convert to shine level
  if (shineScore >= 80) return 'Rainbow';
  if (shineScore >= 60) return 'Diamond';
  if (shineScore >= 40) return 'Gold';
  if (shineScore >= 20) return 'Silver';
  if (shineScore >= 10) return 'Bronze';
  return 'None';
};