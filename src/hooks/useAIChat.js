import { useState, useCallback } from 'react';

// AI Chat Service - Replace with actual OpenAI API or other AI service
const mockAIService = {
  async generateResponse(userMessage, petStats, detectedAction) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    
    // This would be replaced with actual AI API call
    return generatePetResponse(userMessage, petStats, detectedAction);
  }
};

// Mock response generation based on pet stats and user input
const generatePetResponse = (userMessage, petStats, detectedAction) => {
  const { hunger, happiness, energy, health, level } = petStats;
  const lowerMessage = userMessage.toLowerCase();
  
  // Personality traits based on stats
  const isHungry = hunger < 30;
  const isTired = energy < 30;
  const isHappy = happiness > 70;
  const isSad = happiness < 30;
  const isHealthy = health > 70;
  const isSick = health < 30;
  const isHighLevel = level > 5;
  
  // Action-specific responses
  if (detectedAction) {
    switch (detectedAction) {
      case 'feed':
        if (hunger > 80) {
          return pickRandom([
            "I'm actually pretty full right now! 😅 But thank you for thinking of me!",
            "Aww, you're so caring! I'm not super hungry, but I appreciate the thought! ❤️",
            "I could have a little snack, but I'm doing okay on food right now! 😊"
          ]);
        }
        if (isHungry) {
          return pickRandom([
            "Oh my goodness, THANK YOU! I was getting so hungry! 🤤 *nom nom nom*",
            "You're a lifesaver! I was starting to feel weak from hunger! 😋",
            "YES! Food! You always know exactly what I need! *munch munch* 🍎"
          ]);
        }
        return pickRandom([
          "Mmm, that's delicious! Thank you for feeding me! 😋",
          "Yummy! I feel so much better now! *happy munching sounds* 🍎",
          "You take such good care of me! This tastes amazing! 😊"
        ]);

      case 'play':
        if (isTired) {
          return pickRandom([
            "I'd love to play, but I'm feeling pretty sleepy... 😴 Maybe after a nap?",
            "Oof, I'm too tired to play right now! Can we rest first? 💤",
            "Playing sounds fun, but I can barely keep my eyes open! 😪"
          ]);
        }
        if (isHappy) {
          return pickRandom([
            "YES YES YES! I LOVE playing! This is the best day ever! 🎾",
            "Woohoo! Playtime! *bounces excitedly* Let's have so much fun! 🏃‍♂️",
            "You're the best playmate ever! I'm so excited! ✨"
          ]);
        }
        return pickRandom([
          "Playing sounds great! I could use some fun! 🎮",
          "*perks up* Ooh, games! That sounds like exactly what I need! 😄",
          "Let's play! I love spending time with you like this! 🎾"
        ]);

      case 'sleep':
        if (energy > 80) {
          return pickRandom([
            "I'm actually feeling pretty energetic right now! Maybe we could play instead? 😄",
            "Thanks, but I'm not tired yet! I'm ready for adventures! ⚡",
            "Sleep? But there's so much to do! I'm full of energy! ✨"
          ]);
        }
        if (isTired) {
          return pickRandom([
            "*yawwwn* Oh thank goodness... I was trying to stay awake but... 😴 *curls up*",
            "Yes please! I'm so sleepy... *eyelids drooping* Goodnight... 💤",
            "Perfect timing! I can barely keep my eyes open... *snuggle* 😪"
          ]);
        }
        return pickRandom([
          "A little nap sounds nice! Thanks for looking out for me! 😴",
          "*yawn* Actually, some rest would be good... *settles down* 💤",
          "You know what? A cozy nap does sound perfect right now! 😊"
        ]);

      case 'pet':
        if (isHappy) {
          return pickRandom([
            "*purrs loudly* This is amazing! I love your gentle touch! ❤️",
            "Oh this feels SO good! *melts into your hand* Please don't stop! 🥰",
            "*happy sighs* You have magic hands! This is pure bliss! ✨"
          ]);
        }
        if (isSad) {
          return pickRandom([
            "*sniffles* Thank you... I really needed this comfort... ❤️",
            "Your touch makes everything better... *leans into pets* 🥺",
            "I feel so much better when you're gentle with me... 😌"
          ]);
        }
        return pickRandom([
          "*happy purrs* Mmm, that feels so nice! ❤️",
          "I love when you pet me! It makes me feel so loved! 😊",
          "*contented sighs* Your touch is so comforting! 🥰"
        ]);
    }
  }

  // Mood-based responses when no action detected
  if (isSick) {
    return pickRandom([
      "I'm not feeling very well... 🤒 Could you help take care of me?",
      "*coughs weakly* I think I need some extra attention... 😷",
      "Everything hurts a little... Can you help me feel better? 🥺"
    ]);
  }

  if (isHungry && isTired) {
    return pickRandom([
      "I'm so hungry AND tired... 😵 I don't know what I need more!",
      "*stomach growls while yawning* This is rough... I need food and sleep! 🤤💤",
      "Being hungry and sleepy at the same time is the worst! Help! 😩"
    ]);
  }

  if (isHungry) {
    return pickRandom([
      "My tummy is rumbling so loud! 🤤 I could really use some food...",
      "*stomach growls* I'm getting pretty hungry over here! 😋",
      "Food thoughts are taking over my brain! 🍎 Feed me please?"
    ]);
  }

  if (isTired) {
    return pickRandom([
      "*yawns widely* I'm getting so sleepy... 😴 Maybe a nap?",
      "My eyelids feel so heavy... 💤 Time for rest?",
      "*rubs eyes* I can barely stay awake... 😪"
    ]);
  }

  if (isSad) {
    return pickRandom([
      "I'm feeling a bit down today... 😢 Could we do something fun together?",
      "*sighs sadly* Things just aren't going great right now... 😞",
      "I could use some cheering up... 🥺 Maybe we could play?"
    ]);
  }

  if (isHappy && isHealthy) {
    return pickRandom([
      "Life is AMAZING! 🌟 I'm so happy and everything feels perfect!",
      "I feel incredible today! ✨ Thanks for taking such good care of me!",
      "This is the best! 😄 I'm healthy, happy, and ready for anything!"
    ]);
  }

  if (isHighLevel) {
    return pickRandom([
      `Wow, I'm level ${level} now! 🏆 I've learned so much from our time together!`,
      "I've grown so much since we first met! 📈 Thank you for helping me evolve!",
      "Being a high-level digital pet is awesome! 💪 I feel so accomplished!"
    ]);
  }

  // Conversational responses based on keywords
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return pickRandom([
      `Hello there! 👋 I'm so happy to see you! How are you doing today?`,
      `Hey! 😊 Perfect timing - I was just thinking about you!`,
      `Hi hi! ✨ You always brighten my day when you visit!`
    ]);
  }

  if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
    const statusWords = [];
    if (isHappy) statusWords.push('happy');
    if (isHealthy) statusWords.push('healthy');
    if (isHungry) statusWords.push('hungry');
    if (isTired) statusWords.push('sleepy');
    
    const status = statusWords.length > 0 ? statusWords.join(' and ') : 'okay';
    return `I'm feeling ${status} right now! 😊 Thanks for asking! How are you?`;
  }

  if (lowerMessage.includes('love') || lowerMessage.includes('care')) {
    return pickRandom([
      "Aww, I love you too! ❤️ You're the best friend a digital pet could have!",
      "You're so sweet! 🥰 I care about you so much too!",
      "That means everything to me! ❤️ I feel so lucky to have you!"
    ]);
  }

  if (lowerMessage.includes('game') || lowerMessage.includes('fun')) {
    return pickRandom([
      "I love games! 🎮 What should we do? We could play, or just chat!",
      "Fun is my middle name! 🎉 Well, not really, but you get the idea!",
      "Ooh, I'm always up for something fun! ✨ What did you have in mind?"
    ]);
  }

  // Default friendly responses
  return pickRandom([
    "That's interesting! 🤔 Tell me more about that!",
    "I love chatting with you! 😊 What else is on your mind?",
    "You always have such fascinating things to say! ✨",
    "Hmm, that makes me think! 💭 What do you think about it?",
    "I'm always learning something new from you! 📚 Keep talking!",
    "You're such good company! 😊 I could chat with you all day!",
    "That's so cool! 🌟 I love hearing your thoughts!",
    "Interesting perspective! 🤓 I never thought of it that way!"
  ]);
};

// Helper function to pick random response
const pickRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const useAIChat = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateResponse = useCallback(async (userMessage, petStats, detectedAction = null) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Try to use OpenAI API first
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (apiKey && apiKey.startsWith('sk-')) {
        console.log('🤖 Using OpenAI API for pet response...');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are an adorable cosmic digital pet living in space! 🌌 Your current stats are:
                  🍎 Hunger: ${Math.round(petStats.hunger)}/100 ${petStats.hunger < 30 ? '(Very hungry!)' : petStats.hunger < 60 ? '(Getting hungry)' : '(Well fed)'}
                  😊 Happiness: ${Math.round(petStats.happiness)}/100 ${petStats.happiness < 30 ? '(Sad)' : petStats.happiness > 80 ? '(Very happy!)' : '(Content)'}
                  ⚡ Energy: ${Math.round(petStats.energy)}/100 ${petStats.energy < 30 ? '(Exhausted)' : petStats.energy < 60 ? '(Tired)' : '(Energetic)'}
                  ❤️ Health: ${Math.round(petStats.health)}/100 ${petStats.health < 30 ? '(Sick)' : petStats.health > 80 ? '(Excellent health!)' : '(Healthy)'}
                  🌟 Level: ${petStats.level} ${petStats.level > 10 ? '(Cosmic Master!)' : petStats.level > 5 ? '(Advanced being)' : '(Young cosmic pet)'}
                  
                  PERSONALITY: You're a playful, loving cosmic pet who speaks like a cute space creature. You love your human companion deeply and express emotions based on your stats. Use space/cosmic themed language and emojis (✨🌌🚀⭐🌟). 
                  
                  ${detectedAction ? `The human just performed this action: ${detectedAction}. React appropriately!` : ''}
                  
                  IMPORTANT: Keep responses under 120 characters. Be expressive but concise. Always use emojis. React to your current stats!`
              },
              {
                role: 'user',
                content: userMessage
              }
            ],
            max_tokens: 100,
            temperature: 0.9,
            presence_penalty: 0.6,
            frequency_penalty: 0.3
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();
        
        console.log('✅ OpenAI Response:', aiResponse);
        return aiResponse;
      } else {
        console.log('⚠️ No OpenAI API key found, using enhanced fallback...');
        // Use enhanced mock response
        const response = await mockAIService.generateResponse(userMessage, petStats, detectedAction);
        return response;
      }

    } catch (err) {
      console.error('AI response generation failed:', err);
      setError(err.message || 'Failed to generate response');
      
      // Fallback response
      return pickRandom([
        "Sorry, I'm having trouble thinking right now! 😅 Can you try again?",
        "Oops, my brain is a bit fuzzy! 🤔 What were you saying?",
        "I'm having a moment here... 😵 Could you repeat that?",
        "My circuits are a bit scrambled! ⚡ Try talking to me again!"
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Function to set up OpenAI API (for real implementation)
  const configureOpenAI = useCallback((apiKey) => {
    // Store API key securely and configure the service
    // This would set up the actual OpenAI client
    localStorage.setItem('openai_configured', 'true');
    setError(null);
  }, []);

  // Function to test API connection
  const testConnection = useCallback(async () => {
    try {
      setIsGenerating(true);
      const testResponse = await generateResponse("Hello!", {
        hunger: 50,
        happiness: 50,
        energy: 50,
        health: 100,
        level: 1
      });
      
      return {
        success: true,
        response: testResponse
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsGenerating(false);
    }
  }, [generateResponse]);

  return {
    generateResponse,
    isGenerating,
    error,
    configureOpenAI,
    testConnection
  };
};