// Dynamic NFT Metadata Service for Digital Pet Game
// Handles creation, updates, and management of NFT metadata that changes based on pet stats

// IPFS/Storage configuration (replace with actual service)
const STORAGE_CONFIG = {
  pinataApiKey: process.env.REACT_APP_PINATA_API_KEY,
  pinataSecretKey: process.env.REACT_APP_PINATA_SECRET_KEY,
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs/',
  // Fallback to local storage for demo
  useLocalStorage: !process.env.REACT_APP_PINATA_API_KEY
};

class NFTMetadataService {
  constructor() {
    this.initialized = false;
    this.baseMetadata = {
      name: "Digital Pet NFT",
      description: "An AI-powered digital pet that evolves based on your care and interactions.",
      external_url: "https://your-game-url.com",
      animation_url: null, // For future 3D models or animations
      background_color: "87CEEB",
      attributes: []
    };
  }

  // Initialize the service
  async initialize() {
    this.initialized = true;
    return { success: true, message: 'NFT Metadata service initialized' };
  }

  // Generate metadata for a new pet
  async generateInitialMetadata(petStats, walletAddress) {
    const timestamp = Date.now();
    const petId = `pet_${timestamp}`;

    // Generate initial appearance based on stats
    const appearance = this.generateAppearanceData(petStats);

    const metadata = {
      ...this.baseMetadata,
      name: `Digital Pet #${petId}`,
      description: "A newly born digital pet NFT! Care for it and watch it grow and evolve.",
      image: appearance.imageUrl,
      attributes: [
        // Basic info
        { trait_type: "Pet ID", value: petId },
        { trait_type: "Generation", value: 1 },
        { trait_type: "Born", value: new Date().toISOString().split('T')[0] },
        { trait_type: "Owner", value: walletAddress },
        
        // Current stats
        { trait_type: "Level", value: petStats.level || 1 },
        { trait_type: "Health", value: Math.round(petStats.health) },
        { trait_type: "Happiness", value: Math.round(petStats.happiness) },
        { trait_type: "Hunger", value: Math.round(petStats.hunger) },
        { trait_type: "Energy", value: Math.round(petStats.energy) },
        { trait_type: "Experience", value: petStats.experience || 0 },
        
        // Appearance traits
        { trait_type: "Body Color", value: appearance.bodyColor },
        { trait_type: "Eye Type", value: appearance.eyeType },
        { trait_type: "Mood", value: this.determineMood(petStats) },
        
        // Rarity and special traits
        { trait_type: "Species", value: "Digital Pet" },
        { trait_type: "Rarity", value: this.determineRarity(petStats) },
        
        // Evolution stage
        { trait_type: "Evolution Stage", value: this.getEvolutionStage(petStats.level) },
        
        // Interaction counts (for gamification)
        { trait_type: "Times Fed", value: 0 },
        { trait_type: "Times Played", value: 0 },
        { trait_type: "Times Rested", value: 0 },
        
        // Timestamps
        { trait_type: "Last Updated", value: new Date().toISOString() },
        { trait_type: "Last Interaction", value: new Date().toISOString() }
      ],
      
      // Custom properties for game logic
      gameData: {
        petId,
        currentStats: petStats,
        birthTime: timestamp,
        totalInteractions: 0,
        evolutionHistory: [
          {
            stage: 1,
            level: petStats.level || 1,
            timestamp: timestamp,
            trigger: 'birth'
          }
        ],
        achievements: [],
        specialEvents: []
      }
    };

    return metadata;
  }

  // Update metadata when pet stats change
  async updateMetadata(currentMetadata, newStats, interactionType = null) {
    const timestamp = Date.now();
    const appearance = this.generateAppearanceData(newStats);
    
    // Check if pet evolved (level up)
    const oldLevel = this.getAttributeValue(currentMetadata, 'Level');
    const newLevel = newStats.level;
    const evolved = newLevel > oldLevel;

    // Update interaction counts
    const interactionCounts = this.updateInteractionCounts(currentMetadata, interactionType);

    // Check for achievements
    const newAchievements = this.checkForAchievements(newStats, currentMetadata.gameData);

    const updatedMetadata = {
      ...currentMetadata,
      image: appearance.imageUrl, // Update image if appearance changed
      attributes: [
        // Preserve basic info
        ...currentMetadata.attributes.filter(attr => 
          ['Pet ID', 'Generation', 'Born', 'Owner', 'Species'].includes(attr.trait_type)
        ),
        
        // Update current stats
        { trait_type: "Level", value: newLevel },
        { trait_type: "Health", value: Math.round(newStats.health) },
        { trait_type: "Happiness", value: Math.round(newStats.happiness) },
        { trait_type: "Hunger", value: Math.round(newStats.hunger) },
        { trait_type: "Energy", value: Math.round(newStats.energy) },
        { trait_type: "Experience", value: newStats.experience || 0 },
        
        // Update appearance
        { trait_type: "Body Color", value: appearance.bodyColor },
        { trait_type: "Eye Type", value: appearance.eyeType },
        { trait_type: "Mood", value: this.determineMood(newStats) },
        
        // Update dynamic traits
        { trait_type: "Rarity", value: this.determineRarity(newStats) },
        { trait_type: "Evolution Stage", value: this.getEvolutionStage(newLevel) },
        
        // Update interaction counts
        { trait_type: "Times Fed", value: interactionCounts.fed },
        { trait_type: "Times Played", value: interactionCounts.played },
        { trait_type: "Times Rested", value: interactionCounts.rested },
        
        // Update timestamps
        { trait_type: "Last Updated", value: new Date().toISOString() },
        { trait_type: "Last Interaction", value: new Date().toISOString() }
      ],
      
      // Update game data
      gameData: {
        ...currentMetadata.gameData,
        currentStats: newStats,
        totalInteractions: currentMetadata.gameData.totalInteractions + 1,
        evolutionHistory: evolved ? [
          ...currentMetadata.gameData.evolutionHistory,
          {
            stage: this.getEvolutionStage(newLevel),
            level: newLevel,
            timestamp: timestamp,
            trigger: 'level_up'
          }
        ] : currentMetadata.gameData.evolutionHistory,
        achievements: [
          ...currentMetadata.gameData.achievements,
          ...newAchievements
        ],
        specialEvents: interactionType ? [
          ...currentMetadata.gameData.specialEvents.slice(-9), // Keep last 10 events
          {
            type: interactionType,
            timestamp: timestamp,
            statsAfter: { ...newStats }
          }
        ] : currentMetadata.gameData.specialEvents
      }
    };

    return {
      metadata: updatedMetadata,
      evolved,
      newAchievements,
      needsImageUpdate: appearance.changed
    };
  }

  // Generate appearance data based on stats
  generateAppearanceData(stats) {
    const { happiness, hunger, energy, health, level } = stats;
    
    // Determine body color based on overall condition
    let bodyColor = 'Blue'; // Default
    const overallCondition = (happiness + hunger + energy + health) / 4;
    
    if (overallCondition >= 80) bodyColor = 'Golden';
    else if (overallCondition >= 60) bodyColor = 'Green';
    else if (overallCondition >= 40) bodyColor = 'Blue';
    else if (overallCondition >= 20) bodyColor = 'Purple';
    else bodyColor = 'Gray';
    
    // Determine eye type based on mood and level
    let eyeType = 'Normal';
    if (happiness > 80) eyeType = 'Sparkly';
    else if (happiness < 30) eyeType = 'Sad';
    else if (energy < 30) eyeType = 'Sleepy';
    else if (level > 10) eyeType = 'Wise';
    else if (health < 30) eyeType = 'Tired';
    
    // Generate image URL (placeholder - replace with AI image generation)
    const imageVariant = this.getImageVariant(stats);
    const imageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${bodyColor}&backgroundColor=${this.getBackgroundColor(stats)}&eyes=${eyeType.toLowerCase()}&variant=${imageVariant}`;
    
    return {
      bodyColor,
      eyeType,
      imageUrl,
      changed: true // In real implementation, compare with previous appearance
    };
  }

  // Determine pet mood based on stats
  determineMood(stats) {
    const { happiness, hunger, energy, health } = stats;
    
    if (health < 20) return 'Sick';
    if (hunger < 20) return 'Starving';
    if (energy < 20) return 'Exhausted';
    if (happiness < 30) return 'Sad';
    if (happiness > 80 && hunger > 70 && energy > 70) return 'Ecstatic';
    if (happiness > 60) return 'Happy';
    if (energy > 80) return 'Energetic';
    return 'Content';
  }

  // Determine rarity based on stats and achievements
  determineRarity(stats) {
    const { level, health, happiness, experience } = stats;
    
    // Calculate rarity score
    let rarity = 0;
    if (level > 20) rarity += 3;
    else if (level > 10) rarity += 2;
    else if (level > 5) rarity += 1;
    
    if (health > 90) rarity += 2;
    if (happiness > 90) rarity += 2;
    if (experience > 1000) rarity += 2;
    
    // Return rarity tier
    if (rarity >= 7) return 'Legendary';
    if (rarity >= 5) return 'Epic';
    if (rarity >= 3) return 'Rare';
    if (rarity >= 1) return 'Uncommon';
    return 'Common';
  }

  // Get evolution stage based on level
  getEvolutionStage(level) {
    if (level >= 25) return 5; // Master
    if (level >= 20) return 4; // Elder  
    if (level >= 15) return 3; // Adult
    if (level >= 10) return 2; // Teen
    if (level >= 5) return 1; // Child
    return 0; // Baby
  }

  // Update interaction counts
  updateInteractionCounts(metadata, interactionType) {
    const fed = this.getAttributeValue(metadata, 'Times Fed') || 0;
    const played = this.getAttributeValue(metadata, 'Times Played') || 0;
    const rested = this.getAttributeValue(metadata, 'Times Rested') || 0;

    const counts = { fed, played, rested };
    
    if (interactionType === 'feed') counts.fed++;
    if (interactionType === 'play') counts.played++;  
    if (interactionType === 'sleep') counts.rested++;

    return counts;
  }

  // Check for new achievements
  checkForAchievements(stats, gameData) {
    const achievements = [];
    const existingAchievements = gameData.achievements.map(a => a.type);

    // Level achievements
    if (stats.level >= 10 && !existingAchievements.includes('level_10')) {
      achievements.push({
        type: 'level_10',
        name: 'Growing Strong',
        description: 'Reached level 10',
        timestamp: Date.now()
      });
    }

    // Stats achievements
    if (stats.happiness >= 90 && !existingAchievements.includes('max_happiness')) {
      achievements.push({
        type: 'max_happiness',
        name: 'Pure Joy',
        description: 'Achieved maximum happiness',
        timestamp: Date.now()
      });
    }

    // Interaction achievements
    const totalInteractions = gameData.totalInteractions;
    if (totalInteractions >= 100 && !existingAchievements.includes('social_butterfly')) {
      achievements.push({
        type: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Had 100 interactions',
        timestamp: Date.now()
      });
    }

    return achievements;
  }

  // Helper methods
  getAttributeValue(metadata, traitType) {
    const attribute = metadata.attributes?.find(attr => attr.trait_type === traitType);
    return attribute ? attribute.value : null;
  }

  getImageVariant(stats) {
    return Math.floor(((stats.level || 1) + (stats.happiness || 50)) / 20) % 8;
  }

  getBackgroundColor(stats) {
    const colors = ['87CEEB', '98FB98', 'FFB6C1', 'DDA0DD', 'F0E68C', 'FFA07A'];
    return colors[Math.floor((stats.level || 1) / 5) % colors.length];
  }

  // Upload metadata to IPFS (placeholder implementation)
  async uploadToIPFS(metadata) {
    if (STORAGE_CONFIG.useLocalStorage) {
      // Store in localStorage for demo
      try {
        const hash = 'Qm' + Math.random().toString(36).substr(2, 44);
        localStorage.setItem(`ipfs_${hash}`, JSON.stringify(metadata));
        return { 
          success: true, 
          hash, 
          url: `${STORAGE_CONFIG.ipfsGateway}${hash}`
        };
      } catch (error) {
        console.warn('Failed to save metadata to localStorage:', error);
        throw error;
      }
    }

    // In real implementation, upload to Pinata or other IPFS service
    try {
      const formData = new FormData();
      formData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
      formData.append('pinataMetadata', JSON.stringify({ name: `${metadata.name}_metadata.json` }));

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': STORAGE_CONFIG.pinataApiKey,
          'pinata_secret_api_key': STORAGE_CONFIG.pinataSecretKey
        },
        body: formData
      });

      const result = await response.json();
      return {
        success: true,
        hash: result.IpfsHash,
        url: `${STORAGE_CONFIG.ipfsGateway}${result.IpfsHash}`
      };
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  // Retrieve metadata from IPFS
  async getFromIPFS(hash) {
    if (STORAGE_CONFIG.useLocalStorage) {
      const stored = localStorage.getItem(`ipfs_${hash}`);
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const response = await fetch(`${STORAGE_CONFIG.ipfsGateway}${hash}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to retrieve metadata: ${error.message}`);
    }
  }
}

// Export singleton instance
export const nftMetadataService = new NFTMetadataService();

// Initialize the service
nftMetadataService.initialize();

export default nftMetadataService;