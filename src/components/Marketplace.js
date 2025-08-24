import React, { useState, useEffect } from 'react';
import './Marketplace.css';

const Marketplace = ({ 
  walletState, 
  ownedNFTs, 
  onMintPet, 
  onSelectPet, 
  currentPet,
  isMinting,
  mintError 
}) => {
  const [activeTab, setActiveTab] = useState('mint');
  const [mintingOptions, setMintingOptions] = useState({
    species: 'digital-pet',
    color: 'blue',
    personality: 'friendly',
    specialTrait: 'none'
  });
  const [showMintModal, setShowMintModal] = useState(false);

  // Pet species options with different costs and rarities
  const petSpecies = [
    {
      id: 'digital-pet',
      name: 'Digital Pet',
      description: 'The classic friendly companion',
      cost: 0.001,
      rarity: 'Common',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=digital-pet'
    },
    {
      id: 'cyber-dragon',
      name: 'Cyber Dragon',
      description: 'A mystical digital dragon',
      cost: 0.005,
      rarity: 'Rare',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber-dragon&eyes=dragon'
    },
    {
      id: 'quantum-cat',
      name: 'Quantum Cat',
      description: 'A mysterious quantum feline',
      cost: 0.003,
      rarity: 'Uncommon',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=quantum-cat&mouth=cat'
    },
    {
      id: 'void-spirit',
      name: 'Void Spirit',
      description: 'A rare ethereal being',
      cost: 0.01,
      rarity: 'Legendary',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=void-spirit&backgroundColor=000000'
    }
  ];

  const colorOptions = [
    { id: 'blue', name: 'Ocean Blue', hex: '#3B82F6' },
    { id: 'green', name: 'Forest Green', hex: '#10B981' },
    { id: 'pink', name: 'Blossom Pink', hex: '#F472B6' },
    { id: 'purple', name: 'Royal Purple', hex: '#8B5CF6' },
    { id: 'golden', name: 'Golden', hex: '#F59E0B' },
    { id: 'silver', name: 'Silver', hex: '#6B7280' }
  ];

  const personalityOptions = [
    { id: 'friendly', name: 'Friendly', description: 'Loves to chat and play' },
    { id: 'playful', name: 'Playful', description: 'High energy, loves games' },
    { id: 'calm', name: 'Calm', description: 'Peaceful and meditative' },
    { id: 'energetic', name: 'Energetic', description: 'Always ready for action' },
    { id: 'wise', name: 'Wise', description: 'Thoughtful and philosophical' }
  ];

  const specialTraits = [
    { id: 'none', name: 'None', description: 'Standard pet', cost: 0 },
    { id: 'lucky', name: 'Lucky', description: '+50% experience gain', cost: 0.002 },
    { id: 'hardy', name: 'Hardy', description: 'Health decays 50% slower', cost: 0.002 },
    { id: 'social', name: 'Social', description: 'Happiness increases faster', cost: 0.001 },
    { id: 'nocturnal', name: 'Nocturnal', description: 'Active during night hours', cost: 0.001 },
    { id: 'shiny', name: 'Shiny', description: 'Rare sparkly appearance', cost: 0.005 }
  ];

  // Calculate total minting cost
  const getTotalCost = () => {
    const speciesCost = petSpecies.find(s => s.id === mintingOptions.species)?.cost || 0;
    const traitCost = specialTraits.find(t => t.id === mintingOptions.specialTrait)?.cost || 0;
    return speciesCost + traitCost;
  };

  const handleMintPet = async () => {
    if (!walletState.isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    const selectedSpecies = petSpecies.find(s => s.id === mintingOptions.species);
    const selectedColor = colorOptions.find(c => c.id === mintingOptions.color);
    const selectedPersonality = personalityOptions.find(p => p.id === mintingOptions.personality);
    const selectedTrait = specialTraits.find(t => t.id === mintingOptions.specialTrait);

    const petCharacteristics = {
      species: selectedSpecies.name,
      color: selectedColor.name.toLowerCase(),
      personality: selectedPersonality.id,
      specialTrait: selectedTrait.id,
      rarity: selectedSpecies.rarity,
      mintCost: getTotalCost()
    };

    try {
      await onMintPet(null, petCharacteristics);
      setShowMintModal(false);
    } catch (error) {
      console.error('Failed to mint pet:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'common': return '#6b7280';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h2>🏪 Pet Marketplace</h2>
        <p>Mint new pets, manage your collection, and trade with other players</p>
      </div>

      {/* Tab Navigation */}
      <div className="marketplace-tabs">
        <button 
          className={`tab-button ${activeTab === 'mint' ? 'active' : ''}`}
          onClick={() => setActiveTab('mint')}
        >
          🎯 Mint New Pet
        </button>
        <button 
          className={`tab-button ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          🏠 My Collection ({ownedNFTs.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          🛒 Trading Market
        </button>
      </div>

      {/* Mint Tab */}
      {activeTab === 'mint' && (
        <div className="mint-section">
          <div className="species-grid">
            {petSpecies.map(species => (
              <div 
                key={species.id}
                className={`species-card ${mintingOptions.species === species.id ? 'selected' : ''}`}
                onClick={() => setMintingOptions(prev => ({ ...prev, species: species.id }))}
              >
                <div className="species-image">
                  <img src={species.image} alt={species.name} />
                </div>
                <h3>{species.name}</h3>
                <p className="species-description">{species.description}</p>
                <div className="species-details">
                  <span 
                    className="rarity-badge" 
                    style={{ backgroundColor: getRarityColor(species.rarity) }}
                  >
                    {species.rarity}
                  </span>
                  <span className="cost-badge">{species.cost} ETH</span>
                </div>
              </div>
            ))}
          </div>

          {/* Customization Options */}
          <div className="customization-section">
            <h3>🎨 Customize Your Pet</h3>
            
            {/* Color Selection */}
            <div className="option-group">
              <label>Color:</label>
              <div className="color-options">
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    className={`color-option ${mintingOptions.color === color.id ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setMintingOptions(prev => ({ ...prev, color: color.id }))}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Personality Selection */}
            <div className="option-group">
              <label>Personality:</label>
              <select 
                value={mintingOptions.personality}
                onChange={(e) => setMintingOptions(prev => ({ ...prev, personality: e.target.value }))}
                className="personality-select"
              >
                {personalityOptions.map(personality => (
                  <option key={personality.id} value={personality.id}>
                    {personality.name} - {personality.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Traits */}
            <div className="option-group">
              <label>Special Trait:</label>
              <select 
                value={mintingOptions.specialTrait}
                onChange={(e) => setMintingOptions(prev => ({ ...prev, specialTrait: e.target.value }))}
                className="trait-select"
              >
                {specialTraits.map(trait => (
                  <option key={trait.id} value={trait.id}>
                    {trait.name} - {trait.description} {trait.cost > 0 && `(+${trait.cost} ETH)`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mint Summary */}
          <div className="mint-summary">
            <div className="summary-details">
              <h3>Minting Summary</h3>
              <div className="summary-item">
                <span>Species:</span>
                <span>{petSpecies.find(s => s.id === mintingOptions.species)?.name}</span>
              </div>
              <div className="summary-item">
                <span>Color:</span>
                <span>{colorOptions.find(c => c.id === mintingOptions.color)?.name}</span>
              </div>
              <div className="summary-item">
                <span>Personality:</span>
                <span>{personalityOptions.find(p => p.id === mintingOptions.personality)?.name}</span>
              </div>
              <div className="summary-item">
                <span>Special Trait:</span>
                <span>{specialTraits.find(t => t.id === mintingOptions.specialTrait)?.name}</span>
              </div>
              <div className="summary-item total-cost">
                <span>Total Cost:</span>
                <span>{getTotalCost()} ETH</span>
              </div>
            </div>

            <button 
              className="mint-button"
              onClick={handleMintPet}
              disabled={!walletState.isConnected || isMinting}
            >
              {isMinting ? '🔄 Minting...' : '🎯 Mint Pet'}
            </button>

            {mintError && (
              <div className="error-message">
                ⚠️ {mintError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collection Tab */}
      {activeTab === 'collection' && (
        <div className="collection-section">
          {ownedNFTs.length === 0 ? (
            <div className="empty-collection">
              <h3>🏠 Your Pet Collection is Empty</h3>
              <p>Start by minting your first pet in the "Mint New Pet" tab!</p>
            </div>
          ) : (
            <div className="pets-grid">
              {ownedNFTs.map(nft => (
                <div 
                  key={nft.tokenId}
                  className={`pet-card ${currentPet?.tokenId === nft.tokenId ? 'active' : ''}`}
                  onClick={() => onSelectPet(nft)}
                >
                  <div className="pet-image">
                    <img src={nft.metadata?.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'} alt={nft.metadata?.name || 'Pet'} />
                    {currentPet?.tokenId === nft.tokenId && (
                      <div className="active-badge">Currently Playing</div>
                    )}
                  </div>
                  
                  <div className="pet-info">
                    <h4>{nft.metadata?.name || `Pet #${nft.tokenId}`}</h4>
                    <p className="pet-level">Level {nft.metadata?.stats?.level || 1}</p>
                    
                    <div className="pet-stats-mini">
                      <div className="stat-mini">
                        <span>❤️</span>
                        <span>{Math.round(nft.metadata?.stats?.health || 100)}</span>
                      </div>
                      <div className="stat-mini">
                        <span>😊</span>
                        <span>{Math.round(nft.metadata?.stats?.happiness || 50)}</span>
                      </div>
                      <div className="stat-mini">
                        <span>🍎</span>
                        <span>{Math.round(nft.metadata?.stats?.hunger || 50)}</span>
                      </div>
                      <div className="stat-mini">
                        <span>⚡</span>
                        <span>{Math.round(nft.metadata?.stats?.energy || 50)}</span>
                      </div>
                    </div>

                    <div className="pet-traits">
                      {nft.metadata?.attributes?.map(attr => (
                        ['Rarity', 'Species'].includes(attr.trait_type) && (
                          <span 
                            key={attr.trait_type}
                            className="trait-badge"
                            style={{ 
                              backgroundColor: attr.trait_type === 'Rarity' ? getRarityColor(attr.value) : '#6b7280'
                            }}
                          >
                            {attr.value}
                          </span>
                        )
                      ))}
                    </div>

                    <div className="pet-actions">
                      <button 
                        className="select-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPet(nft);
                        }}
                        disabled={currentPet?.tokenId === nft.tokenId}
                      >
                        {currentPet?.tokenId === nft.tokenId ? '✓ Selected' : '🎮 Play'}
                      </button>
                      <button className="trade-button" disabled>
                        💼 Trade (Soon)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trading Market Tab */}
      {activeTab === 'market' && (
        <div className="market-section">
          <div className="coming-soon">
            <h3>🛒 Trading Market</h3>
            <p>Pet trading and marketplace features coming soon!</p>
            <div className="planned-features">
              <div className="feature-item">
                <span>🔄</span>
                <div>
                  <h4>Pet Trading</h4>
                  <p>Trade pets with other players</p>
                </div>
              </div>
              <div className="feature-item">
                <span>🏷️</span>
                <div>
                  <h4>Marketplace Listings</h4>
                  <p>Buy and sell pets for ETH</p>
                </div>
              </div>
              <div className="feature-item">
                <span>🤝</span>
                <div>
                  <h4>Pet Breeding</h4>
                  <p>Breed pets to create new offspring</p>
                </div>
              </div>
              <div className="feature-item">
                <span>🏆</span>
                <div>
                  <h4>Competitions</h4>
                  <p>Enter pets in tournaments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!walletState.isConnected && (
        <div className="wallet-required">
          <p>🔗 Connect your wallet to access marketplace features</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;