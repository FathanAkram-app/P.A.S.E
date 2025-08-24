// Image Service for Digital Pet NFT Game
// Handles placeholder images and prepares for AI-generated pet images

// Configuration for AI image generation services
const AI_IMAGE_CONFIG = {
  // OpenAI DALL-E 3
  openai: {
    endpoint: 'https://api.openai.com/v1/images/generations',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'standard'
  },
  
  // Stability AI
  stability: {
    endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    width: 1024,
    height: 1024,
    samples: 1
  },
  
  // Midjourney (via unofficial API)
  midjourney: {
    endpoint: 'https://api.midjourney.com/v1/imagine',
    // Configuration would go here
  }
};

// Placeholder image configurations
const PLACEHOLDER_IMAGES = {
  pets: {
    baby: {
      happy: 'https://api.dicebear.com/7.x/bottts/svg?seed=baby-happy&backgroundColor=87CEEB&eyes=happy&mouth=smile',
      neutral: 'https://api.dicebear.com/7.x/bottts/svg?seed=baby-neutral&backgroundColor=87CEEB&eyes=normal&mouth=neutral',
      sad: 'https://api.dicebear.com/7.x/bottts/svg?seed=baby-sad&backgroundColor=87CEEB&eyes=sad&mouth=frown',
      sick: 'https://api.dicebear.com/7.x/bottts/svg?seed=baby-sick&backgroundColor=gray&eyes=dizzy&mouth=frown'
    },
    child: {
      happy: 'https://api.dicebear.com/7.x/bottts/svg?seed=child-happy&backgroundColor=98FB98&eyes=happy&mouth=smile',
      neutral: 'https://api.dicebear.com/7.x/bottts/svg?seed=child-neutral&backgroundColor=98FB98&eyes=normal&mouth=neutral',
      sad: 'https://api.dicebear.com/7.x/bottts/svg?seed=child-sad&backgroundColor=98FB98&eyes=sad&mouth=frown',
      sick: 'https://api.dicebear.com/7.x/bottts/svg?seed=child-sick&backgroundColor=gray&eyes=dizzy&mouth=frown'
    },
    teen: {
      happy: 'https://api.dicebear.com/7.x/bottts/svg?seed=teen-happy&backgroundColor=FFB6C1&eyes=happy&mouth=smile',
      neutral: 'https://api.dicebear.com/7.x/bottts/svg?seed=teen-neutral&backgroundColor=FFB6C1&eyes=normal&mouth=neutral',
      sad: 'https://api.dicebear.com/7.x/bottts/svg?seed=teen-sad&backgroundColor=FFB6C1&eyes=sad&mouth=frown',
      sick: 'https://api.dicebear.com/7.x/bottts/svg?seed=teen-sick&backgroundColor=gray&eyes=dizzy&mouth=frown'
    },
    adult: {
      happy: 'https://api.dicebear.com/7.x/bottts/svg?seed=adult-happy&backgroundColor=DDA0DD&eyes=happy&mouth=smile',
      neutral: 'https://api.dicebear.com/7.x/bottts/svg?seed=adult-neutral&backgroundColor=DDA0DD&eyes=normal&mouth=neutral',
      sad: 'https://api.dicebear.com/7.x/bottts/svg?seed=adult-sad&backgroundColor=DDA0DD&eyes=sad&mouth=frown',
      sick: 'https://api.dicebear.com/7.x/bottts/svg?seed=adult-sick&backgroundColor=gray&eyes=dizzy&mouth=frown'
    },
    elder: {
      happy: 'https://api.dicebear.com/7.x/bottts/svg?seed=elder-happy&backgroundColor=F0E68C&eyes=happy&mouth=smile',
      neutral: 'https://api.dicebear.com/7.x/bottts/svg?seed=elder-neutral&backgroundColor=F0E68C&eyes=normal&mouth=neutral',
      sad: 'https://api.dicebear.com/7.x/bottts/svg?seed=elder-sad&backgroundColor=F0E68C&eyes=sad&mouth=frown',
      sick: 'https://api.dicebear.com/7.x/bottts/svg?seed=elder-sick&backgroundColor=gray&eyes=dizzy&mouth=frown'
    }
  },
  
  backgrounds: {
    day: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    night: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&q=80',
    forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    space: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80'
  },
  
  items: {
    food: 'https://api.dicebear.com/7.x/bottts/svg?seed=food&backgroundColor=transparent',
    toy: 'https://api.dicebear.com/7.x/bottts/svg?seed=toy&backgroundColor=transparent',
    bed: 'https://api.dicebear.com/7.x/bottts/svg?seed=bed&backgroundColor=transparent'
  }
};

class ImageService {
  constructor() {
    this.cache = new Map();
    this.aiProvider = 'openai'; // Default AI provider
    this.apiKey = null;
    this.initialized = false;
  }

  // Initialize the image service
  async initialize(provider = 'openai', apiKey = null) {
    this.aiProvider = provider;
    this.apiKey = apiKey;
    this.initialized = true;
    
    // Preload some placeholder images
    await this.preloadPlaceholders();
    
    return { success: true, message: 'Image service initialized' };
  }

  // Preload placeholder images for faster display
  async preloadPlaceholders() {
    const imagePromises = [];
    
    // Preload pet images for each stage and mood
    Object.values(PLACEHOLDER_IMAGES.pets).forEach(stage => {
      Object.values(stage).forEach(imageUrl => {
        imagePromises.push(this.preloadImage(imageUrl));
      });
    });
    
    try {
      await Promise.all(imagePromises);
      console.log('Placeholder images preloaded successfully');
    } catch (error) {
      console.warn('Some placeholder images failed to preload:', error);
    }
  }

  // Preload a single image
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  // Get placeholder image for pet based on stats
  getPlaceholderPetImage(stats) {
    const stage = this.getEvolutionStage(stats.level);
    const mood = this.determineMood(stats);
    
    const stageKey = ['baby', 'child', 'teen', 'adult', 'elder'][stage] || 'baby';
    const moodKey = ['happy', 'neutral', 'sad', 'sick'].includes(mood) ? mood : 'neutral';
    
    return PLACEHOLDER_IMAGES.pets[stageKey]?.[moodKey] || PLACEHOLDER_IMAGES.pets.baby.neutral;
  }

  // Generate AI image prompt based on pet stats and characteristics
  generateAIPrompt(stats, characteristics = {}) {
    const { level, happiness, hunger, energy, health } = stats;
    const { species = 'digital pet', color = 'blue', personality = 'friendly' } = characteristics;
    
    // Determine evolution stage
    const stage = this.getEvolutionStage(level);
    const stageNames = ['baby', 'child', 'teenager', 'adult', 'elder'];
    const stageName = stageNames[stage] || 'baby';
    
    // Determine mood
    const mood = this.determineMood(stats);
    
    // Determine overall condition
    const avgCondition = (happiness + hunger + energy + health) / 4;
    let conditionDesc = 'healthy';
    if (avgCondition < 30) conditionDesc = 'struggling';
    else if (avgCondition < 50) conditionDesc = 'okay';
    else if (avgCondition > 80) conditionDesc = 'thriving';
    
    // Build the prompt
    let prompt = `A cute ${personality} ${color} ${species} character, ${stageName} age, currently feeling ${mood} and looking ${conditionDesc}. `;
    
    // Add mood-specific details
    switch (mood) {
      case 'happy':
        prompt += 'Bright sparkling eyes, cheerful expression, maybe jumping or dancing. ';
        break;
      case 'sad':
        prompt += 'Droopy eyes, sad expression, maybe sitting down looking dejected. ';
        break;
      case 'sick':
        prompt += 'Tired eyes, pale colors, maybe lying down or looking weak. ';
        break;
      case 'hungry':
        prompt += 'Looking at food, mouth watering, holding stomach. ';
        break;
      case 'sleepy':
        prompt += 'Droopy eyelids, yawning, maybe holding a pillow or blanket. ';
        break;
      default:
        prompt += 'Neutral expression, calm and content. ';
    }
    
    // Add stage-specific details
    switch (stage) {
      case 0: // Baby
        prompt += 'Very small and round, innocent features, big curious eyes. ';
        break;
      case 1: // Child
        prompt += 'Small but more defined features, playful appearance. ';
        break;
      case 2: // Teen
        prompt += 'Medium size, more detailed features, energetic pose. ';
        break;
      case 3: // Adult
        prompt += 'Full-sized, mature features, confident stance. ';
        break;
      case 4: // Elder
        prompt += 'Wise appearance, maybe some unique markings or accessories showing experience. ';
        break;
    }
    
    prompt += 'Digital art style, NFT artwork, high quality, detailed, colorful, friendly appearance, suitable for a blockchain game character. White background or transparent.';
    
    return prompt;
  }

  // Generate AI image using selected provider
  async generateAIImage(stats, characteristics = {}) {
    if (!this.initialized || !this.apiKey) {
      console.warn('AI image generation not available, using placeholder');
      return {
        success: false,
        imageUrl: this.getPlaceholderPetImage(stats),
        isPlaceholder: true
      };
    }

    const prompt = this.generateAIPrompt(stats, characteristics);
    
    try {
      let imageUrl;
      
      switch (this.aiProvider) {
        case 'openai':
          imageUrl = await this.generateWithOpenAI(prompt);
          break;
        case 'stability':
          imageUrl = await this.generateWithStability(prompt);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${this.aiProvider}`);
      }
      
      // Cache the generated image
      const cacheKey = this.generateCacheKey(stats, characteristics);
      this.cache.set(cacheKey, imageUrl);
      
      return {
        success: true,
        imageUrl: imageUrl,
        isPlaceholder: false,
        prompt: prompt
      };
      
    } catch (error) {
      console.error('AI image generation failed:', error);
      
      // Fallback to placeholder
      return {
        success: false,
        imageUrl: this.getPlaceholderPetImage(stats),
        isPlaceholder: true,
        error: error.message
      };
    }
  }

  // Generate image with OpenAI DALL-E
  async generateWithOpenAI(prompt) {
    const response = await fetch(AI_IMAGE_CONFIG.openai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: AI_IMAGE_CONFIG.openai.model,
        prompt: prompt,
        n: 1,
        size: AI_IMAGE_CONFIG.openai.size,
        quality: AI_IMAGE_CONFIG.openai.quality,
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI image generation failed');
    }

    const data = await response.json();
    return data.data[0].url;
  }

  // Generate image with Stability AI
  async generateWithStability(prompt) {
    const response = await fetch(AI_IMAGE_CONFIG.stability.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        width: AI_IMAGE_CONFIG.stability.width,
        height: AI_IMAGE_CONFIG.stability.height,
        samples: AI_IMAGE_CONFIG.stability.samples,
        steps: 50
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Stability AI generation failed');
    }

    const data = await response.json();
    
    // Convert base64 to blob URL
    const base64Image = data.artifacts[0].base64;
    const blob = this.base64ToBlob(base64Image, 'image/png');
    return URL.createObjectURL(blob);
  }

  // Helper methods
  getEvolutionStage(level) {
    if (level >= 25) return 4; // Elder
    if (level >= 20) return 3; // Adult  
    if (level >= 15) return 2; // Teen
    if (level >= 10) return 1; // Child
    return 0; // Baby
  }

  determineMood(stats) {
    const { hunger, happiness, energy, health } = stats;
    
    if (health < 20) return 'sick';
    if (hunger < 20) return 'hungry';
    if (energy < 20) return 'sleepy';
    if (happiness < 30) return 'sad';
    if (happiness > 80) return 'happy';
    return 'neutral';
  }

  generateCacheKey(stats, characteristics) {
    return `${stats.level}_${Math.floor(stats.happiness/10)}_${Math.floor(stats.health/10)}_${characteristics.color || 'default'}`;
  }

  base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Get cached image if available
  getCachedImage(stats, characteristics = {}) {
    const cacheKey = this.generateCacheKey(stats, characteristics);
    return this.cache.get(cacheKey);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get background image
  getBackgroundImage(timeOfDay = 'day') {
    return PLACEHOLDER_IMAGES.backgrounds[timeOfDay] || PLACEHOLDER_IMAGES.backgrounds.day;
  }

  // Get item image
  getItemImage(itemType) {
    return PLACEHOLDER_IMAGES.items[itemType] || null;
  }
}

// Export singleton instance
export const imageService = new ImageService();

// Export for configuration
export { AI_IMAGE_CONFIG, PLACEHOLDER_IMAGES };

// Setup function for AI image generation
export const setupImageGeneration = async (provider, apiKey) => {
  try {
    await imageService.initialize(provider, apiKey);
    
    // Save configuration
    try {
      localStorage.setItem('imageServiceConfig', JSON.stringify({
        provider,
        hasApiKey: !!apiKey,
        initialized: true
      }));
    } catch (error) {
      console.warn('Failed to save image service config to localStorage:', error);
    }
    
    return { success: true, message: 'AI image generation configured' };
  } catch (error) {
    console.error('Failed to setup image generation:', error);
    throw error;
  }
};

export default imageService;