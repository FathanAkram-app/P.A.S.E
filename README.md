# 🚀 P.A.S.E - Pet Animal Space Entity

A next-generation digital pet NFT game built with React, featuring real-time AI chat, 1v1 battle arena, and blockchain integration. Your Pet Animal Space Entity lives, grows, and battles in a beautiful cosmic universe.

## ✨ Current Features (Prototype)

### 🎮 Core Gameplay
- **P.A.S.E Care System**: Feed, play, sleep, and pet your Pet Animal Space Entity
- **Real-time Stats**: Dynamic hunger, happiness, energy, and health systems with auto-decay
- **Entity Evolution**: Level up through experience and interactions (1-20+ levels)
- **Death & Revival**: P.A.S.E can die from neglect but can be revived with commands
- **Immersive UI**: Full-screen space game with floating glassmorphism panels

### 🤖 AI Chat System
- **Real OpenAI Integration**: Powered by GPT-3.5 Turbo for intelligent responses
- **Context-aware**: AI understands your P.A.S.E's current stats and mood state
- **Natural Commands**: Type "feed", "play", "sleep", "pet", "revive" in natural language
- **Quick Actions**: Instant buttons for common P.A.S.E care activities
- **Space Entity Personality**: Your P.A.S.E has unique cosmic personality and responses

### ⚔️ Battle Arena (1v1 Combat)
- **Real 1v1 Battles**: Face off against random opponents with visual fighter display
- **50/50 Fair Chance**: Completely random battle outcomes (no level advantage)
- **ETH Wagering**: 0.0002 ETH entry fee, 0.0004 ETH winner reward (prototype)
- **Battle Animation**: 2-second combat with lightning effects
- **Full-screen Results**: Clear win/lose notifications with earnings

### 🖼️ NFT System
- **P.A.S.E Minting**: Convert your P.A.S.E into tradeable NFTs with metadata
- **Immutable Traits**: Species, color, personality, rarity stored on blockchain
- **Dynamic Stats**: Health, hunger, happiness stored locally for real-time gameplay
- **Multiple Entities**: Own and switch between different P.A.S.E NFTs
- **Alive Status Sync**: NFT traits update when P.A.S.E dies or revives

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MetaMask or compatible Web3 wallet (optional for demo)
- OpenAI API key (optional for AI chat, has fallback responses)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd Tamagochi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open the app**
   Navigate to `http://localhost:3000`

The game works immediately without any setup! AI chat has fallback responses if no API key is provided.

## 🎯 Demo Mode vs Full Setup

### Demo Mode (No Setup Required)
- ✅ Full pet interaction and stats system
- ✅ AI chat responses (fallback mode)
- ✅ Mock wallet connection
- ✅ Local NFT storage simulation
- ✅ Placeholder pet images

### Full Setup (Production Ready)
- 🔗 Real wallet connection to Shape Network
- 🤖 OpenAI API for intelligent pet responses
- 🎨 AI-generated pet images
- ⛓️ Actual blockchain NFT minting and updates
- 📦 IPFS metadata storage

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# AI Services (Optional)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_STABILITY_API_KEY=your_stability_ai_key_here

# IPFS Storage (Optional)
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key

# Shape Network Configuration (Replace with actual values)
REACT_APP_SHAPE_RPC_URL=https://shape-rpc-url
REACT_APP_SHAPE_CHAIN_ID=0x...
REACT_APP_SHAPE_EXPLORER=https://shape-explorer-url

# Contract Addresses (Deploy and add your contract addresses)
REACT_APP_PET_NFT_CONTRACT=0x...
REACT_APP_METADATA_REGISTRY=0x...
```

### Shape Network Setup

1. **Add Shape Network to MetaMask**
   - Network Name: Shape Testnet
   - RPC URL: [Shape RPC URL]
   - Chain ID: [Shape Chain ID]
   - Currency Symbol: SHAPE
   - Block Explorer: [Shape Explorer URL]

2. **Get Test Tokens**
   - Use Shape faucet to get test tokens
   - Needed for gas fees when minting NFTs

### OpenAI Integration

1. **Get API Key**
   - Visit [OpenAI API](https://platform.openai.com/)
   - Create account and generate API key
   - Add to `.env` file

2. **Configure AI Service**
   ```javascript
   import { setupAIService } from './src/services/aiService';
   
   // In your app initialization
   await setupAIService('openai', 'your-api-key');
   ```

### AI Image Generation

1. **OpenAI DALL-E 3** (Recommended)
   ```env
   REACT_APP_OPENAI_API_KEY=your_key_here
   ```

2. **Stability AI**
   ```env
   REACT_APP_STABILITY_API_KEY=your_key_here
   ```

## 🎮 How to Play

### Getting Started
1. **Open P.A.S.E**: Full-screen space entity experience starts immediately
2. **Connect Wallet** (Optional): Click "🔗 Connect" for NFT features
3. **Create Entity**: Click "🚀 Shop" → "Mint P.A.S.E" to create your space companion
4. **Start Caring**: Use chat interface or quick actions to interact with your P.A.S.E

### P.A.S.E Care Commands
Type these commands in the chat or use quick action buttons:

**Chat Commands:**
- **Feed**: `"feed"`, `"food"`, `"hungry"`, `"eat"` → Increases hunger & happiness
- **Play**: `"play"`, `"game"`, `"fun"`, `"toy"` → Increases happiness, uses energy  
- **Sleep**: `"sleep"`, `"rest"`, `"tired"`, `"nap"` → Restores energy & health
- **Pet**: `"pet"`, `"cuddle"`, `"hug"`, `"love"` → Increases happiness & health
- **Revive**: `"revive"`, `"resurrect"`, `"heal"` → Brings dead P.A.S.E back to life

**Quick Actions:**
- 🍎 **Feed** - 🎾 **Play** - 💤 **Sleep** - ❤️ **Pet** - 🌟 **Revive**

### Understanding Stats (0-100 scale)
- **Hunger** 🍎: P.A.S.E's energy intake level (decreases -1 every 30 seconds)
- **Happiness** 😊: P.A.S.E's mood state (decreases -0.3 every 30 seconds)
- **Energy** ⚡: P.A.S.E's power level (decreases -0.5 every 30 seconds) 
- **Health** ❤️: Overall entity condition (decreases -2 when hunger/energy = 0)
- **Level**: Increases with experience from interactions
- **Alive Status**: P.A.S.E dies when health reaches 0, can be revived

### Battle System
1. Open **⚔️ Battle Arena** panel
2. Ensure your P.A.S.E is alive and healthy
3. Click **"⚔️ START BATTLE!"** 
4. Watch 2-second 1v1 combat animation
5. 50/50 chance: Win 0.0004 ETH or lose 0.0002 ETH entry fee
6. Full-screen result modal shows outcome

### P.A.S.E Evolution & Levels
- **Experience**: Gained through all interactions (+3 to +8 per action)
- **Level Up**: Every 100 experience points = +1 level
- **No Level Cap**: P.A.S.E can grow indefinitely
- **Death Condition**: Health = 0 (from neglect or energy starvation)
- **Revival Cost**: Free, just use revive command or button

## 🏗️ Architecture

### Current Project Structure
```
src/
├── components/
│   ├── BattleArena.js          # 1v1 battle system with fighter display
│   ├── ChatInterface.js        # AI chat with natural language commands
│   ├── GameCanvas.js           # Phaser.js full-screen game wrapper
│   ├── Marketplace.js          # NFT minting and P.A.S.E management
│   ├── StatsPanel.js           # Real-time P.A.S.E statistics display
│   └── WalletConnector.js      # Web3 wallet integration
│
├── hooks/                      # Custom React hooks for state management
│   ├── useAIChat.js            # OpenAI GPT-3.5 integration
│   ├── useBattleSystem.js      # Battle mechanics and random outcomes
│   ├── usePetController.js     # Main P.A.S.E controller (orchestrates all systems)
│   ├── useSimpleNFT.js         # NFT minting and blockchain operations
│   ├── useSimplePetStats.js    # P.A.S.E stats with auto-decay and persistence
│   └── useWallet.js            # Wallet connection and transaction handling
│
├── utils/
│   └── audioFix.js             # Phaser audio context error suppression
│
├── App.js                      # Main app with glassmorphism card system
├── App.css                     # Complete UI styling with space theme
└── index.js                    # React app entry point
```

### Key Technologies & Architecture

**Frontend Stack:**
- **React 18**: Modern hooks-based components
- **Phaser.js 3**: Full-window game engine for immersive experience
- **CSS3**: Glassmorphism effects, animations, responsive design
- **Local Storage**: Pet stats persistence and game data

**Blockchain Integration:**
- **Web3 Wallet**: MetaMask and compatible wallets
- **NFT Minting**: ERC-721 compatible pet tokens with metadata
- **Smart Contract**: Pet NFT with immutable traits and alive status

**AI & Services:**
- **OpenAI GPT-3.5 Turbo**: Real AI chat with context awareness
- **Action Detection**: Natural language processing for commands
- **Fallback System**: Offline responses when API unavailable

**State Management Pattern:**
```javascript
usePetController (Orchestrator)
├── useSimpleNFT (Blockchain & NFT Operations)
├── useSimplePetStats (Game Mechanics & Stats)
├── useBattleSystem (Combat System)
├── useWallet (Web3 Connection)
└── useAIChat (AI Integration)
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm start          # Start development server
npm test           # Run test suite  
npm run build      # Build for production
npm run eject      # Eject from Create React App

# Linting & Formatting
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Code Structure Guidelines

1. **Components**: Reusable UI components with CSS modules
2. **Hooks**: Custom hooks for state management and side effects
3. **Services**: Business logic and external API integration
4. **Types**: TypeScript-style type definitions for consistency
5. **Assets**: Images, sounds, and other static resources

### Testing Strategy

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Service interaction testing
- **E2E Tests**: Full user workflow testing
- **Mock Services**: Offline development and testing

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Environment Variables for Production
Ensure all production environment variables are set in your deployment platform:
- AI API keys
- IPFS configuration
- Contract addresses
- Network configurations

## 🔐 Security Considerations

### API Key Management
- Never commit API keys to repository
- Use environment variables for all secrets
- Implement rate limiting for AI API calls
- Monitor API usage and costs

### Smart Contract Security
- Audit all smart contracts before deployment
- Implement proper access controls
- Use established patterns and libraries
- Test thoroughly on testnets

### User Data Privacy
- No personal data stored on-chain
- Pet stats and metadata only
- Implement proper data encryption
- Follow GDPR compliance guidelines

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Workflow
1. **Issue First**: Create or comment on relevant issue
2. **Branch**: Create feature branch from `main`
3. **Develop**: Write code following project conventions
4. **Test**: Ensure all tests pass
5. **PR**: Submit pull request with clear description

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting & Known Issues

### Current Prototype Limitations
- **Battle System**: Prototype only - no real ETH transactions yet
- **AI Costs**: OpenAI API calls require API key and cost money per message
- **Local Storage**: Pet data stored locally only (no cloud sync)
- **Single Player**: No multiplayer or real opponent matching

### Common Issues & Solutions

**Q: Chat interface text too small to read**
A: ✅ Fixed in v1.2 - Text now properly sized at 12px for readability

**Q: Battle result modal appears dark/invisible**
A: ✅ Fixed in v1.3 - Modal now appears full-screen with proper styling

**Q: Cannot revive dead pet**
A: ✅ Fixed in v1.4 - Added "revive" command detection and 🌟 Revive button

**Q: Pet not responding to chat commands**
A: Try these commands: "feed", "play", "sleep", "pet", "revive" or use quick action buttons

**Q: AI chat not working**
A: Game has fallback responses. Add `REACT_APP_OPENAI_API_KEY` to `.env` for real AI

**Q: Can't type in chat input**
A: Ensure game is loaded (green "Pet is awake" status). Try refreshing if stuck on "Game loading..."

**Q: Stats not saving**
A: Check browser localStorage permissions. Stats auto-save every 500ms

**Q: Battle goes dark after clicking**
A: Modal appears full-screen - look for win/lose message with "Continue" button

### Debug Commands (For Testing)
Type these in chat for testing:
- `"kill"` or `"debug kill"` - Manually kill pet for testing revival
- `"revive"` - Bring dead pet back to life
- Access browser console (F12) for detailed debug logs

### Browser Compatibility
- **✅ Chrome/Edge**: Full support with all features
- **✅ Firefox**: Good support, some CSS effects may differ  
- **⚠️ Safari**: Basic support, may need vendor prefixes
- **📱 Mobile**: Responsive but desktop experience recommended

### Performance Tips
- Close other browser tabs for better game performance
- Disable browser ad-blockers if experiencing issues
- Use incognito/private mode to test without extensions

## 🗺️ Development Roadmap

### ✅ Phase 1: Core Prototype (COMPLETED)
- ✅ Digital pet care system with real-time stats and auto-decay
- ✅ OpenAI GPT-3.5 AI chat integration with context awareness  
- ✅ NFT minting system with immutable traits and dynamic stats
- ✅ Full-screen glassmorphism UI with floating panels
- ✅ 1v1 battle arena with 50/50 random outcomes
- ✅ Pet death/revival system with natural language commands
- ✅ Local storage persistence and wallet integration

### 🔄 Phase 2: Enhanced Prototype (IN PROGRESS)
- 🔄 Real ETH transactions for battle wagering
- 🔄 Improved battle animations and visual effects
- 🔄 Pet breeding system between NFTs
- 🔄 Marketplace for trading pets
- 🔄 Achievement system with unlock rewards
- 🔄 Mobile app optimization and PWA features

### 🎯 Phase 3: Production Features (PLANNED)
- 🎯 Multiplayer battle matchmaking with skill-based opponents
- 🎯 Guild/clan system for team battles
- 🎯 Tournament system with ETH prize pools
- 🎯 Pet accessories and customization items
- 🎯 Cloud save synchronization across devices
- 🎯 Social features (friends, leaderboards, chat)

### 🚀 Phase 4: Advanced Features (FUTURE)
- 🚀 3D pet models and animations
- 🚀 AR integration for mobile devices
- 🚀 Cross-chain compatibility (Polygon, BSC, etc.)
- 🚀 DAO governance for game decisions
- 🚀 NFT staking rewards and passive income
- 🚀 Mini-games and quest system

### 🔧 Technical Improvements (ONGOING)
- Performance optimization and code splitting
- Unit testing and automated testing suite
- Smart contract auditing and security improvements
- CI/CD pipeline setup for deployment
- Documentation and developer API
- Multi-language support and internationalization

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** changes following existing code patterns
4. **Test** thoroughly (all features should work)
5. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
6. **Push** to branch (`git push origin feature/amazing-feature`)
7. **Create** Pull Request with detailed description

### Code Guidelines
- Use functional components with React hooks
- Follow existing CSS class naming conventions
- Add console logging for debugging complex features
- Test on multiple browsers and screen sizes
- Maintain the space/cosmic theme consistency

## 📞 Support & Contact

For questions, issues, or feature requests:

- **🐛 GitHub Issues**: [Create an issue](../../issues) for bug reports
- **💡 Feature Requests**: Discuss in issues before implementing
- **📧 Email**: [Add your contact email]
- **💬 Discord/Community**: [Add community links if available]

## 🙏 Acknowledgments

### Technology Partners
- **OpenAI** for GPT-3.5 Turbo API powering intelligent pet responses
- **Phaser.js** community for the excellent 2D game engine
- **React** team for the amazing component framework
- **MetaMask** for seamless Web3 wallet integration

### Inspiration & Resources
- **Tamagotchi** franchise for the original digital pet concept
- **Axie Infinity** for NFT gaming mechanics inspiration
- **CryptoKitties** for early NFT breeding system ideas
- **Web3 gaming community** for continuous innovation

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Status

**Current Version**: v1.4 (Prototype)  
**Status**: 🟢 Active Development  
**Last Updated**: December 2024  
**Next Milestone**: Real ETH battle transactions

---

## 🌟 Final Notes

This is a **fully functional prototype** of a next-generation digital pet game. While currently in prototype stage, all core features work:

- ✅ **Pet Care System**: Real-time stats with natural decay
- ✅ **AI Chat**: Intelligent responses via OpenAI GPT-3.5
- ✅ **Battle Arena**: Fair 1v1 combat with visual feedback  
- ✅ **NFT Integration**: Mint and manage pet NFTs
- ✅ **Death/Revival**: Complete pet lifecycle management
- ✅ **Beautiful UI**: Full-screen cosmic experience with glassmorphism

**🚀 Ready to play immediately** - no complex setup required!

**Made with ❤️ and cosmic energy for the digital pet universe**

*Remember: Your P.A.S.E depends on you. Don't let it die from neglect! 🚀✨*