// Pet stats interface
export const PetStats = {
  hunger: 0,
  happiness: 0,
  energy: 0,
  health: 0,
  experience: 0,
  level: 1
};

// Pet mood based on stats
export const PetMood = {
  HAPPY: 'happy',
  NEUTRAL: 'neutral',
  SAD: 'sad',
  ANGRY: 'angry',
  SLEEPY: 'sleepy',
  HUNGRY: 'hungry'
};

// Chat message structure
export const ChatMessage = {
  id: '',
  text: '',
  sender: 'user', // 'user' or 'pet'
  timestamp: Date.now()
};

// NFT metadata structure for Shape blockchain
export const NFTMetadata = {
  name: '',
  description: '',
  image: '',
  attributes: [
    {
      trait_type: '',
      value: ''
    }
  ],
  stats: PetStats
};

// Wallet connection state
export const WalletState = {
  isConnected: false,
  address: '',
  network: '',
  error: null
};