# Digital Pet NFT Game Assets

This directory contains all the assets for the Digital Pet NFT Game, including placeholders and preparation for AI-generated content.

## Directory Structure

```
assets/
├── images/           # Pet images, backgrounds, UI elements
├── sounds/          # Sound effects and music (future)
├── icons/           # UI icons and symbols
└── README.md        # This file
```

## Image Assets

### Pet Images
The game uses dynamic pet images that change based on:
- **Evolution Stage**: Baby → Child → Teen → Adult → Elder
- **Mood**: Happy, Sad, Neutral, Sick, Hungry, Sleepy
- **Stats**: Health, Happiness, Hunger, Energy levels
- **Special States**: Evolved, Achievement unlocked, etc.

Currently using placeholder images from:
- DiceBear API for procedural avatar generation
- Unsplash for background images

### AI Image Generation Ready
The system is prepared to integrate with:
- **OpenAI DALL-E 3** - High quality, detailed pet images
- **Stability AI** - Custom trained models for consistent pet appearance
- **Midjourney** - Artistic pet variations (via API when available)

## Sound Assets (Future Implementation)

### Sound Effects
- Pet interaction sounds (feed, play, pet)
- UI feedback sounds (clicks, notifications)
- Mood-based ambient sounds
- Evolution/level-up celebration sounds

### Music
- Ambient background music
- Mood-based musical themes
- Special event music (achievements, evolution)

## Icons and UI Elements

### Status Icons
- Health: ❤️
- Hunger: 🍎
- Happiness: 😊
- Energy: ⚡
- Mood indicators: Various emojis

### Action Icons
- Feed: 🍎
- Play: 🎾
- Sleep: 💤
- Pet: ❤️

## Placeholder System

The game includes a comprehensive placeholder system that:

1. **Provides immediate visual feedback** while AI images generate
2. **Maintains visual consistency** across different pet states
3. **Supports offline development** when AI services aren't available
4. **Serves as fallback** if AI generation fails

## AI Image Integration

### Prompt Engineering
The system generates detailed prompts based on:
```javascript
{
  species: "digital pet",
  stage: "baby|child|teen|adult|elder",
  mood: "happy|sad|neutral|sick|hungry|sleepy",
  condition: "thriving|healthy|okay|struggling",
  personality: "friendly|playful|calm|energetic",
  color: "blue|green|pink|purple|golden"
}
```

### Example Generated Prompt
```
"A cute friendly blue digital pet character, child age, currently feeling happy and looking thriving. Bright sparkling eyes, cheerful expression, maybe jumping or dancing. Small but more defined features, playful appearance. Digital art style, NFT artwork, high quality, detailed, colorful, friendly appearance, suitable for a blockchain game character. White background or transparent."
```

### Image Caching
- Generated images are cached locally
- Cache key based on stats and characteristics
- Reduces API calls and costs
- Improves performance

## Usage in Components

### GameCanvas Component
```javascript
import { imageService } from '../services/imageService';

// Get placeholder image
const petImage = imageService.getPlaceholderPetImage(petStats);

// Generate AI image (when available)
const aiImage = await imageService.generateAIImage(petStats, characteristics);
```

### NFT Metadata
```javascript
import { nftMetadataService } from '../services/nftMetadataService';

// Metadata includes image URL
const metadata = await nftMetadataService.generateInitialMetadata(petStats, walletAddress);
```

## Future Enhancements

### 3D Models
- Integrate with 3D model generation APIs
- Support for GLB/GLTF formats
- Animation support for pet movements

### Video Generation
- Short video clips of pet interactions
- Evolution transformation videos
- Special achievement celebrations

### Custom Backgrounds
- AI-generated environments based on pet preferences
- Seasonal and time-of-day variations
- Interactive background elements

## Development Notes

### Adding New Assets
1. Place files in appropriate subdirectory
2. Update imageService.js with new asset paths
3. Add appropriate fallbacks
4. Test with various pet states

### Performance Considerations
- Optimize image sizes for web delivery
- Implement lazy loading for non-critical assets
- Use WebP format when supported
- Implement proper caching strategies

### Accessibility
- Provide alt text for all images
- Ensure sufficient color contrast
- Support for reduced motion preferences
- Consider screen reader compatibility