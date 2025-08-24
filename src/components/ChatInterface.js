import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import './ChatInterface.css';

const ChatInterface = ({ onInteraction, petStats, disabled }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Greetings, cosmic traveler! ✨ I'm your new astral companion! Send me quantum signals like 'feed', 'play', 'sleep', or just transmit your thoughts to me! 🌌",
      sender: 'pet',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Debug logging
  console.log('ChatInterface props:', { 
    hasOnInteraction: !!onInteraction, 
    disabled, 
    petStats: petStats ? 'present' : 'missing' 
  });
  
  // AI chat integration
  const { generateResponse } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Chat form submitted:', { inputText, disabled, isLoading });
    
    if (!inputText.trim() || disabled || isLoading) {
      console.log('❌ Submission blocked:', { 
        noText: !inputText.trim(), 
        disabled, 
        isLoading 
      });
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    console.log('💬 Adding user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Analyze user input for pet actions
      const action = detectPetAction(inputText);
      
      // Call interaction handler if action detected
      if (action && onInteraction) {
        console.log('🎮 Calling onInteraction with action:', action, 'message:', inputText);
        await onInteraction(action, inputText);
      } else if (!onInteraction) {
        console.log('⚠️ No onInteraction function provided!');
      }

      // Generate AI response
      console.log('🤖 Generating AI response for:', inputText);
      const aiResponse = await generateResponse(inputText, petStats, action);
      
      const petMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'pet',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, petMessage]);
      
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        text: getRandomResponse(inputText, petStats),
        sender: 'pet',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const detectPetAction = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('feed') || lowerText.includes('food') || lowerText.includes('hungry') || lowerText.includes('eat')) {
      return 'feed';
    } else if (lowerText.includes('play') || lowerText.includes('game') || lowerText.includes('fun') || lowerText.includes('toy')) {
      return 'play';
    } else if (lowerText.includes('sleep') || lowerText.includes('rest') || lowerText.includes('tired') || lowerText.includes('nap')) {
      return 'sleep';
    } else if (lowerText.includes('pet') || lowerText.includes('cuddle') || lowerText.includes('hug') || lowerText.includes('love')) {
      return 'pet';
    } else if (lowerText.includes('revive') || lowerText.includes('resurrect') || lowerText.includes('bring back') || lowerText.includes('heal')) {
      return 'revive';
    } else if (lowerText.includes('kill') || lowerText.includes('debug kill') || lowerText.includes('test death')) {
      return 'kill';
    }
    
    return null;
  };

  const getRandomResponse = (userText, stats) => {
    const action = detectPetAction(userText);
    
    // Action-based responses
    if (action === 'feed') {
      const responses = [
        "Yum yum! 🍎 Thank you for feeding me!",
        "Nom nom nom! That was delicious! 😋",
        "I feel much better now! My hunger is satisfied! 🤤",
        "Thanks for the food! I'm getting stronger! 💪"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (action === 'play') {
      const responses = [
        "Woohoo! Let's play! This is so much fun! 🎾",
        "I love playing with you! *bounces excitedly* 🏃‍♂️",
        "Play time! My happiness is through the roof! 😄",
        "Catch me if you can! *runs around* 🏃‍♀️"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (action === 'sleep') {
      const responses = [
        "Time for a nap... *yawn* 😴 Goodnight!",
        "Zzz... I'll have sweet dreams! 💤",
        "Thank you for letting me rest. I feel refreshed! 😊",
        "*curls up* This is so cozy... 🛌"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (action === 'pet') {
      const responses = [
        "Aww, I love cuddles! *purrs* ❤️",
        "Your touch makes me so happy! 🥰",
        "More pets please! This feels amazing! 😊",
        "*leans into your hand* That's the spot! 😌"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (action === 'revive') {
      const responses = [
        "Thank you for bringing me back! I feel alive again! 🌟",
        "*gasps* I'm back! The light... it's so beautiful! ✨",
        "You saved me! I can feel my cosmic energy returning! 💫",
        "I'm alive! Thank you for not giving up on me! 🙏"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Mood-based responses
    if (stats.hunger < 20) {
      const responses = [
        "I'm getting really hungry... 🤤 Could you feed me?",
        "My tummy is rumbling! 😋 Food would be great!",
        "I haven't eaten in a while... 🍎 Some food would be nice!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (stats.energy < 20) {
      const responses = [
        "I'm feeling so sleepy... 😴 Maybe I should rest?",
        "*yawn* I'm getting tired... 💤 Time for a nap?",
        "My energy is low... 😪 I could use some sleep!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (stats.happiness > 80) {
      const responses = [
        "I'm so happy right now! 😄 Life is great!",
        "You're the best! I feel amazing! ✨",
        "Everything is wonderful! 🌟 Thanks for taking care of me!",
        "I'm bursting with joy! 🎉 This is the best day ever!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (stats.happiness < 30) {
      const responses = [
        "I'm feeling a bit down... 😢 Could we play together?",
        "Things aren't great right now... 😔 Some fun would help!",
        "I'm not feeling my best... 😞 Maybe some attention?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // General responses
    const generalResponses = [
      "That's interesting! Tell me more! 🤔",
      "I love chatting with you! 😊",
      "You're so nice to talk to! ❤️",
      "I'm here if you need anything! 🐾",
      "Life as a digital pet is pretty cool! ✨",
      "What would you like to do together? 🎮",
      "I'm always happy to see you! 😄",
      "Thanks for spending time with me! 🥰"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const quickActions = [
    { text: 'Feed', action: 'feed', emoji: '🍎' },
    { text: 'Play', action: 'play', emoji: '🎾' },
    { text: 'Sleep', action: 'sleep', emoji: '💤' },
    { text: 'Pet', action: 'pet', emoji: '❤️' },
    { text: 'Revive', action: 'revive', emoji: '🌟' }
  ];

  const handleQuickAction = async (actionText) => {
    console.log('⚡ Quick action clicked:', actionText);
    
    if (disabled || isLoading) {
      console.log('❌ Quick action blocked:', { disabled, isLoading });
      return;
    }
    
    // Directly trigger the action instead of just setting input text
    const userMessage = {
      id: Date.now(),
      text: actionText,
      sender: 'user',
      timestamp: new Date()
    };

    console.log('💬 Adding quick action message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Detect the action from the text
      const action = detectPetAction(actionText);
      console.log('🎯 Detected action:', action);
      
      // Call interaction handler if action detected
      if (action && onInteraction) {
        console.log('🎮 Calling onInteraction with action:', action);
        await onInteraction(action, actionText);
      }

      // Generate AI response
      const aiResponse = await generateResponse(actionText, petStats, action);
      
      const petMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'pet',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, petMessage]);
      
    } catch (error) {
      console.error('❌ Quick action error:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        text: getRandomResponse(actionText, petStats),
        sender: 'pet',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      {/* Only show header if not in floating panel */}
      <div className="chat-header">
        <div className="connection-status">
          {disabled ? (
            <span className="status-offline">🔴 Game Loading...</span>
          ) : (
            <span className="status-online">🟢 Pet is awake</span>
          )}
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'pet-message'}`}
          >
            <div className="message-content">
              {message.sender === 'pet' && <span className="pet-avatar">🐾</span>}
              <div className="message-bubble">
                <p>{message.text}</p>
                <small className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </small>
              </div>
              {message.sender === 'user' && <span className="user-avatar">👤</span>}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message pet-message">
            <div className="message-content">
              <span className="pet-avatar">🐾</span>
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        {quickActions.map(action => (
          <button
            key={action.action}
            className="quick-action-btn"
            onClick={() => handleQuickAction(action.text)}
            disabled={disabled}
            title={`${action.text} your pet`}
          >
            {action.emoji} {action.text}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              console.log('📝 Input changed:', e.target.value);
              setInputText(e.target.value);
            }}
            onFocus={() => console.log('🔍 Input focused')}
            onBlur={() => console.log('💨 Input blurred')}
            placeholder={disabled ? "Game loading..." : "Type a message or action..."}
            disabled={disabled || isLoading}
            className="chat-input"
            maxLength={200}
            autoComplete="off"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || disabled || isLoading}
            className="send-button"
            onClick={(e) => {
              console.log('🖱️ Send button clicked');
              if (!inputText.trim()) {
                console.log('❌ No text to send');
                e.preventDefault();
              }
            }}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        
        {/* Debug info */}
        <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
          Debug: disabled={disabled ? 'true' : 'false'}, loading={isLoading ? 'true' : 'false'}, text="{inputText}"
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;