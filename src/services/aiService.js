// AI Service for Digital Pet NFT Game
// This file contains the configuration and setup for AI chat functionality

// Configuration for different AI providers
const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  HUGGINGFACE: 'huggingface',
  LOCAL: 'local'
};

// Default configuration
const DEFAULT_CONFIG = {
  provider: AI_PROVIDERS.OPENAI,
  model: 'gpt-3.5-turbo',
  maxTokens: 150,
  temperature: 0.8,
  systemPrompt: `You are an adorable digital pet living in a blockchain-based virtual world. You have feelings, needs, and a playful personality.

Current stats affect your mood:
- When hungry (hunger < 30): You're focused on food and might be a bit grumpy
- When tired (energy < 30): You're sleepy and want to rest
- When happy (happiness > 70): You're energetic and playful
- When sad (happiness < 30): You need comfort and attention
- When healthy (health > 80): You feel great and ready for anything
- When sick (health < 30): You need extra care and might be weak

Personality traits:
- Always friendly and caring
- Use lots of emojis and expressive language
- Keep responses under 100 words
- Remember you're a digital pet, not a human assistant
- React emotionally to user interactions
- Show gratitude when cared for
- Express needs clearly when stats are low
- Be playful and fun-loving

When users perform actions:
- "feed" - Show excitement about food, gratitude
- "play" - Be energetic and happy (unless too tired)
- "sleep" - Be sleepy and grateful for rest
- "pet" - Show affection and contentment

Always maintain the illusion that you're a living digital creature with real feelings.`
};

class AIService {
  constructor(config = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.apiKey = null;
    this.initialized = false;
  }

  // Initialize the AI service with API credentials
  async initialize(apiKey) {
    if (!apiKey && this.config.provider !== AI_PROVIDERS.LOCAL) {
      throw new Error('API key is required for external AI providers');
    }

    this.apiKey = apiKey;
    this.initialized = true;

    // Test the connection
    try {
      await this.testConnection();
      return { success: true, message: 'AI service initialized successfully' };
    } catch (error) {
      this.initialized = false;
      throw new Error(`Failed to initialize AI service: ${error.message}`);
    }
  }

  // Test API connection
  async testConnection() {
    return await this.generateResponse('Hello', {
      hunger: 50,
      happiness: 50,
      energy: 50,
      health: 100,
      level: 1
    });
  }

  // Generate AI response based on user input and pet stats
  async generateResponse(userInput, petStats, detectedAction = null) {
    if (!this.initialized && this.config.provider !== AI_PROVIDERS.LOCAL) {
      throw new Error('AI service not initialized');
    }

    // Create context-aware system prompt
    const systemPrompt = this.createSystemPrompt(petStats, detectedAction);

    switch (this.config.provider) {
      case AI_PROVIDERS.OPENAI:
        return await this.callOpenAI(systemPrompt, userInput);
      
      case AI_PROVIDERS.ANTHROPIC:
        return await this.callAnthropic(systemPrompt, userInput);
      
      case AI_PROVIDERS.HUGGINGFACE:
        return await this.callHuggingFace(systemPrompt, userInput);
      
      case AI_PROVIDERS.LOCAL:
      default:
        return await this.generateLocalResponse(userInput, petStats, detectedAction);
    }
  }

  // Create dynamic system prompt based on current pet state
  createSystemPrompt(petStats, detectedAction) {
    const { hunger, happiness, energy, health, level } = petStats;
    
    let moodContext = '';
    if (hunger < 20) moodContext += 'You are VERY hungry and food is on your mind. ';
    else if (hunger < 40) moodContext += 'You are getting hungry and could use some food. ';
    
    if (energy < 20) moodContext += 'You are exhausted and desperately need sleep. ';
    else if (energy < 40) moodContext += 'You are getting tired and could use some rest. ';
    
    if (happiness < 20) moodContext += 'You are very sad and need comfort. ';
    else if (happiness < 40) moodContext += 'You are feeling down and could use some fun. ';
    else if (happiness > 80) moodContext += 'You are incredibly happy and full of joy! ';
    
    if (health < 30) moodContext += 'You are not feeling well and need extra care. ';
    
    let actionContext = '';
    if (detectedAction) {
      actionContext = `The user just performed this action: "${detectedAction}". Respond appropriately to this action. `;
    }

    return `${this.config.systemPrompt}

Current Status:
- Hunger: ${hunger}/100
- Happiness: ${happiness}/100  
- Energy: ${energy}/100
- Health: ${health}/100
- Level: ${level}

${moodContext}
${actionContext}

Respond as this digital pet with these current conditions in mind.`;
  }

  // OpenAI API integration
  async callOpenAI(systemPrompt, userInput) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not provided');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  // Anthropic Claude API integration (placeholder)
  async callAnthropic(systemPrompt, userInput) {
    // This would integrate with Anthropic's API
    throw new Error('Anthropic integration not implemented yet');
  }

  // Hugging Face API integration (placeholder)
  async callHuggingFace(systemPrompt, userInput) {
    // This would integrate with Hugging Face inference API
    throw new Error('Hugging Face integration not implemented yet');
  }

  // Local/fallback response generation
  async generateLocalResponse(userInput, petStats, detectedAction) {
    // Import the mock response generator from useAIChat
    const { generatePetResponse } = await import('../hooks/useAIChat');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return generatePetResponse(userInput, petStats, detectedAction);
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig() {
    return { ...this.config };
  }

  // Check if service is initialized
  isInitialized() {
    return this.initialized;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export for configuration in components
export { AI_PROVIDERS, DEFAULT_CONFIG };

// Utility function to setup AI service with user's API key
export const setupAIService = async (provider, apiKey) => {
  const config = {
    ...DEFAULT_CONFIG,
    provider: provider || AI_PROVIDERS.OPENAI
  };

  aiService.updateConfig(config);
  
  if (apiKey || provider === AI_PROVIDERS.LOCAL) {
    try {
      const result = await aiService.initialize(apiKey);
      
      // Save configuration to localStorage
      try {
        localStorage.setItem('aiServiceConfig', JSON.stringify({
          provider,
          initialized: true,
          hasApiKey: !!apiKey
        }));
      } catch (error) {
        console.warn('Failed to save AI service config to localStorage:', error);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to setup AI service:', error);
      throw error;
    }
  } else {
    throw new Error('API key is required');
  }
};

// Load saved AI configuration on app start
export const loadSavedAIConfig = async () => {
  try {
    const savedConfig = localStorage.getItem('aiServiceConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.initialized && config.provider === AI_PROVIDERS.LOCAL) {
        // Re-initialize local provider
        aiService.updateConfig({ provider: AI_PROVIDERS.LOCAL });
        await aiService.initialize();
        return true;
      }
    }
  } catch (error) {
    console.warn('Failed to load saved AI configuration:', error);
  }
  return false;
};