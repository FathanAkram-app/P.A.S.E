import { useState, useEffect, useCallback } from 'react';

// Helper function to get color hex values
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

// Mock Shape NFT Contract - Replace with actual Shape NFT contract integration
const mockShapeNFTContract = {
  async mintNFT(walletAddress, metadata) {
    // Simulate minting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful mint
    return {
      success: true,
      tokenId: Math.floor(Math.random() * 10000),
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      metadata: metadata
    };
  },

  async updateNFTMetadata(tokenId, newMetadata) {
    // Simulate update delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      tokenId: tokenId,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      updatedMetadata: newMetadata
    };
  },

  async getNFTsByOwner(walletAddress) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check localStorage for existing NFTs
    const existingNFTs = localStorage.getItem(`nfts_${walletAddress}`);
    if (existingNFTs) {
      return JSON.parse(existingNFTs);
    }
    
    return [];
  },

  async getNFTMetadata(tokenId) {
    // Simulate metadata fetch
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      name: `Digital Pet #${tokenId}`,
      description: 'An AI-powered digital pet NFT that grows and evolves based on interactions.',
      image: `https://api.dicebear.com/7.x/bottts/svg?seed=${tokenId}`,
      attributes: [
        { trait_type: 'Species', value: 'Digital Pet' },
        { trait_type: 'Generation', value: '1' },
        { trait_type: 'Rarity', value: 'Common' }
      ]
    };
  }
};

export const useShapeNFT = (walletAddress) => {
  const [nftState, setNftState] = useState({
    nftData: null,
    isLoading: false,
    isMinting: false,
    isUpdating: false,
    error: null,
    ownedNFTs: []
  });

  // Load NFTs when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      loadUserNFTs();
    } else {
      setNftState(prev => ({
        ...prev,
        nftData: null,
        ownedNFTs: []
      }));
    }
  }, [walletAddress]);

  // Load user's NFTs
  const loadUserNFTs = useCallback(async () => {
    if (!walletAddress) return;

    setNftState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const ownedNFTs = await mockShapeNFTContract.getNFTsByOwner(walletAddress);
      
      // Get the first (main) pet NFT
      const mainPetNFT = ownedNFTs.length > 0 ? ownedNFTs[0] : null;
      
      setNftState(prev => ({
        ...prev,
        nftData: mainPetNFT,
        ownedNFTs: ownedNFTs,
        isLoading: false
      }));

    } catch (error) {
      console.error('Failed to load NFTs:', error);
      setNftState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load NFTs'
      }));
    }
  }, [walletAddress]);

  // Mint new pet NFT
  const mintPet = useCallback(async (petStats = null, characteristics = {}) => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    setNftState(prev => ({ ...prev, isMinting: true, error: null }));

    try {
      // Generate initial metadata with characteristics
      const petId = Date.now();
      const metadata = {
        name: characteristics.species ? `${characteristics.species} #${petId}` : `Digital Pet #${petId}`,
        description: `An AI-powered ${characteristics.species || 'digital pet'} NFT with ${characteristics.personality || 'friendly'} personality that grows and evolves based on interactions.`,
        image: `https://api.dicebear.com/7.x/bottts/svg?seed=${characteristics.species || 'digital-pet'}-${characteristics.color || 'blue'}&backgroundColor=${getColorHex(characteristics.color)}`, 
        attributes: [
          { trait_type: 'Species', value: characteristics.species || 'Digital Pet' },
          { trait_type: 'Color', value: characteristics.color || 'Blue' },
          { trait_type: 'Personality', value: characteristics.personality || 'Friendly' },
          { trait_type: 'Rarity', value: characteristics.rarity || 'Common' },
          ...(characteristics.specialTrait && characteristics.specialTrait !== 'none' ? 
            [{ trait_type: 'Special Trait', value: characteristics.specialTrait }] : []),
          { trait_type: 'Generation', value: '1' },
          { trait_type: 'Birth Date', value: new Date().toISOString() },
          { trait_type: 'Level', value: petStats?.level || 1 },
          { trait_type: 'Happiness', value: petStats?.happiness || 50 },
          { trait_type: 'Hunger', value: petStats?.hunger || 50 },
          { trait_type: 'Energy', value: petStats?.energy || 50 },
          { trait_type: 'Health', value: petStats?.health || 100 }
        ],
        stats: petStats || {
          hunger: 50,
          happiness: 50,
          energy: 50,
          health: 100,
          experience: 0,
          level: 1
        }
      };

      // Mint NFT
      const result = await mockShapeNFTContract.mintNFT(walletAddress, metadata);

      if (result.success) {
        const newNFT = {
          tokenId: result.tokenId,
          owner: walletAddress,
          metadata: metadata,
          transactionHash: result.transactionHash,
          mintedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };

        // Save to localStorage (in real app, this would be on blockchain)
        let existingNFTs = [];
        try {
          existingNFTs = JSON.parse(localStorage.getItem(`nfts_${walletAddress}`) || '[]');
          existingNFTs.unshift(newNFT);
          localStorage.setItem(`nfts_${walletAddress}`, JSON.stringify(existingNFTs));
        } catch (error) {
          console.warn('Failed to save NFT to localStorage:', error);
          existingNFTs = [newNFT]; // Fallback if localStorage fails
        }

        setNftState(prev => ({
          ...prev,
          nftData: newNFT,
          ownedNFTs: existingNFTs,
          isMinting: false
        }));

        return {
          success: true,
          tokenId: result.tokenId,
          transactionHash: result.transactionHash
        };
      }
    } catch (error) {
      console.error('Minting failed:', error);
      setNftState(prev => ({
        ...prev,
        isMinting: false,
        error: error.message || 'Minting failed'
      }));
      
      throw error;
    }
  }, [walletAddress]);

  // Update NFT metadata with new pet stats
  const updateNFTMetadata = useCallback(async (newStats) => {
    if (!nftState.nftData || !walletAddress) {
      throw new Error('No NFT to update or wallet not connected');
    }

    setNftState(prev => ({ ...prev, isUpdating: true, error: null }));

    try {
      const currentNFT = nftState.nftData;
      
      // Update metadata with new stats
      const updatedMetadata = {
        ...currentNFT.metadata,
        attributes: [
          { trait_type: 'Species', value: 'Digital Pet' },
          { trait_type: 'Generation', value: '1' },
          { trait_type: 'Birth Date', value: currentNFT.metadata.attributes.find(a => a.trait_type === 'Birth Date')?.value || new Date().toISOString() },
          { trait_type: 'Level', value: newStats.level },
          { trait_type: 'Happiness', value: Math.round(newStats.happiness) },
          { trait_type: 'Hunger', value: Math.round(newStats.hunger) },
          { trait_type: 'Energy', value: Math.round(newStats.energy) },
          { trait_type: 'Health', value: Math.round(newStats.health) },
          { trait_type: 'Experience', value: newStats.experience },
          { trait_type: 'Last Updated', value: new Date().toISOString() }
        ],
        stats: newStats
      };

      // Update on "blockchain" (mock)
      const result = await mockShapeNFTContract.updateNFTMetadata(
        currentNFT.tokenId,
        updatedMetadata
      );

      if (result.success) {
        const updatedNFT = {
          ...currentNFT,
          metadata: updatedMetadata,
          lastUpdated: new Date().toISOString(),
          updateTransactionHash: result.transactionHash
        };

        // Update localStorage
        let existingNFTs = [];
        try {
          existingNFTs = JSON.parse(localStorage.getItem(`nfts_${walletAddress}`) || '[]');
          const nftIndex = existingNFTs.findIndex(nft => nft.tokenId === currentNFT.tokenId);
          if (nftIndex !== -1) {
            existingNFTs[nftIndex] = updatedNFT;
            localStorage.setItem(`nfts_${walletAddress}`, JSON.stringify(existingNFTs));
          } else {
            existingNFTs.push(updatedNFT);
          }
        } catch (error) {
          console.warn('Failed to update NFT in localStorage:', error);
          existingNFTs = [updatedNFT]; // Fallback if localStorage fails
        }

        setNftState(prev => ({
          ...prev,
          nftData: updatedNFT,
          ownedNFTs: existingNFTs,
          isUpdating: false
        }));

        return {
          success: true,
          transactionHash: result.transactionHash
        };
      }
    } catch (error) {
      console.error('Failed to update NFT metadata:', error);
      setNftState(prev => ({
        ...prev,
        isUpdating: false,
        error: error.message || 'Failed to update NFT metadata'
      }));
      
      throw error;
    }
  }, [nftState.nftData, walletAddress]);

  // Generate new AI image for pet (placeholder)
  const generateNewPetImage = useCallback(async (petStats) => {
    // In a real implementation, this would call an AI image generation service
    // based on the pet's current stats, mood, and level
    
    // For now, we'll use a deterministic image based on stats
    const imageVariant = Math.floor((petStats.level + petStats.happiness) / 20) % 8;
    const newImageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${nftState.nftData?.tokenId || 'default'}&variant=${imageVariant}`;
    
    return {
      success: true,
      imageUrl: newImageUrl,
      message: 'Your pet\'s appearance has evolved!'
    };
  }, [nftState.nftData]);

  // Get NFT display info
  const getNFTDisplayInfo = useCallback(() => {
    if (!nftState.nftData) return null;

    const nft = nftState.nftData;
    const stats = nft.metadata.stats || {};
    
    return {
      tokenId: nft.tokenId,
      name: nft.metadata.name,
      image: nft.metadata.image,
      level: stats.level || 1,
      happiness: stats.happiness || 50,
      lastUpdated: nft.lastUpdated,
      owner: nft.owner,
      mintedAt: nft.mintedAt
    };
  }, [nftState.nftData]);

  return {
    nftData: nftState.nftData,
    ownedNFTs: nftState.ownedNFTs,
    isLoading: nftState.isLoading,
    isMinting: nftState.isMinting,
    isUpdating: nftState.isUpdating,
    error: nftState.error,
    mintPet,
    updateNFTMetadata,
    loadUserNFTs,
    generateNewPetImage,
    getNFTDisplayInfo
  };
};