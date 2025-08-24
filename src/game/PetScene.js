import Phaser from 'phaser';

export default class PetScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PetScene' });
    this.pet = null;
    this.moodIndicator = null;
    this.hungerIndicator = null;
    this.statsText = null;
    this.floatingTexts = [];
    this.currentMood = 'neutral';
  }

  preload() {
    // Create simple colored rectangles as placeholders for pet sprites
    this.load.image('pet-happy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('pet-neutral', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('pet-sad', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    // Load background
    this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Set up the space background
    this.cameras.main.setBackgroundColor('#0a0015');
    
    // Add space background elements
    this.createSpaceBackground();
    
    // Create the pet sprite
    this.createPet();
    
    // Create UI elements
    this.createUI();
    
    // Set up animations
    this.setupAnimations();
    
    // Handle clicks on pet - set up hit area for graphics object
    this.pet.setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains);
    this.pet.on('pointerdown', () => {
      this.petClicked();
    });

    // Notify parent component that game is loaded
    if (this.scene.settings.data && this.scene.settings.data.onGameLoaded) {
      this.scene.settings.data.onGameLoaded();
    }
  }

  createSpaceBackground() {
    const graphics = this.add.graphics();
    
    // Create nebula clouds
    graphics.fillStyle(0x8b5cf6, 0.3);
    graphics.fillCircle(100, 80, 60);
    graphics.fillStyle(0x06b6d4, 0.2);
    graphics.fillCircle(120, 100, 40);
    
    graphics.fillStyle(0x10b981, 0.2);
    graphics.fillCircle(400, 120, 50);
    graphics.fillStyle(0x8b5cf6, 0.1);
    graphics.fillCircle(420, 140, 35);
    
    // Create stars
    graphics.fillStyle(0xffffff);
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, this.cameras.main.width);
      const y = Phaser.Math.Between(0, this.cameras.main.height);
      const size = Phaser.Math.Between(1, 3);
      graphics.fillCircle(x, y, size);
    }
    
    // Create planets in background
    graphics.fillStyle(0x4c1d95, 0.6);
    graphics.fillCircle(this.cameras.main.width - 100, 100, 25);
    
    graphics.fillStyle(0x065f46, 0.5);
    graphics.fillCircle(50, this.cameras.main.height - 60, 30);
    
    // Add cosmic dust/particles
    graphics.fillStyle(0x8b5cf6, 0.1);
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, this.cameras.main.width);
      const y = Phaser.Math.Between(0, this.cameras.main.height);
      graphics.fillCircle(x, y, 1);
    }
  }

  createPet() {
    // Create pet as a simple colored circle with face
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    // Pet body (circle)
    this.pet = this.add.graphics();
    this.pet.x = centerX;
    this.pet.y = centerY;
    
    this.updatePetAppearance('neutral');
    
    // Add some physics for bouncing
    this.physics.world.enable(this.pet);
    this.pet.body.setBounce(0.7);
    this.pet.body.setCollideWorldBounds(true);
  }

  updatePetAppearance(mood) {
    this.currentMood = mood;
    this.pet.clear();
    
    // Get pet data from scene settings
    const petStats = this.scene.settings.data?.petStats || {};
    const evolutionStage = petStats.evolutionStage || 1;
    const lifeStage = petStats.lifeStage || 'baby';
    const level = petStats.level || 1;
    const isDead = petStats.isDead || false;
    
    let bodyColor, eyeColor, mouthCurve, auraColor, petSize, auraIntensity;
    
    // Death appearance
    if (isDead) {
      bodyColor = 0x4b5563; // Gray
      eyeColor = 0x6b7280; // Light gray
      auraColor = 0x374151; // Dark gray
      mouthCurve = -1;
      petSize = 0.8;
      auraIntensity = 0.1;
    } else {
      // Evolution stage affects colors and size
      const evolutionColors = {
        1: { body: 0x06b6d4, aura: 0x10b981 }, // Cyan/Green - Basic
        2: { body: 0x8b5cf6, aura: 0x06b6d4 }, // Purple/Cyan - Evolved
        3: { body: 0x10b981, aura: 0x8b5cf6 }, // Green/Purple - Advanced
        4: { body: 0xf59e0b, aura: 0x10b981 }, // Gold/Green - Elite
        5: { body: 0xff6b6b, aura: 0xf59e0b }  // Red/Gold - Cosmic Master
      };
      
      const baseColors = evolutionColors[evolutionStage] || evolutionColors[1];
      
      // Life stage affects size
      const lifeStageSizes = {
        'baby': 0.7,
        'child': 0.8,
        'teen': 0.9,
        'adult': 1.0,
        'elder': 1.1
      };
      
      petSize = lifeStageSizes[lifeStage] || 1.0;
      
      // Mood affects colors and expressions
      switch (mood) {
        case 'happy':
          bodyColor = baseColors.body;
          eyeColor = 0x06b6d4; // Bright cyan
          auraColor = 0x10b981; // Bright green
          mouthCurve = 1; // Smile
          auraIntensity = 0.8;
          break;
        case 'sad':
          bodyColor = this.darkenColor(baseColors.body, 0.6);
          eyeColor = 0x3b82f6; // Blue
          auraColor = 0x6366f1; // Indigo
          mouthCurve = -1; // Frown
          auraIntensity = 0.3;
          break;
        case 'angry':
          bodyColor = this.blendColors(baseColors.body, 0xdc2626, 0.5);
          eyeColor = 0xff0000; // Bright red
          auraColor = 0xf59e0b; // Orange
          mouthCurve = -1;
          auraIntensity = 1.0;
          break;
        case 'sleepy':
          bodyColor = this.darkenColor(baseColors.body, 0.7);
          eyeColor = baseColors.aura;
          auraColor = this.darkenColor(baseColors.aura, 0.5);
          mouthCurve = 0; // Neutral
          auraIntensity = 0.2;
          break;
        case 'hungry':
          bodyColor = this.blendColors(baseColors.body, 0x10b981, 0.3);
          eyeColor = 0x06b6d4; // Cyan
          auraColor = 0xf59e0b; // Orange
          mouthCurve = 0;
          auraIntensity = 0.5;
          break;
        case 'sick':
          bodyColor = this.darkenColor(baseColors.body, 0.5);
          eyeColor = 0x6b7280; // Gray
          auraColor = 0x374151; // Dark gray
          mouthCurve = -1;
          auraIntensity = 0.1;
          break;
        default: // neutral
          bodyColor = baseColors.body;
          eyeColor = baseColors.aura;
          auraColor = baseColors.aura;
          mouthCurve = 0;
          auraIntensity = 0.5;
      }
    }
    
    // Apply size scaling
    this.pet.setScale(petSize);
    
    // Draw evolutionary cosmic aura - more complex for higher evolution stages
    const baseRadius = 50;
    const auraRadius1 = baseRadius + 15;
    const auraRadius2 = baseRadius + 30;
    
    // Multiple aura layers for higher evolution stages
    for (let i = 0; i < evolutionStage; i++) {
      const layerRadius = auraRadius1 + (i * 8);
      const layerAlpha = (auraIntensity * 0.3) / (i + 1);
      this.pet.fillStyle(auraColor, layerAlpha);
      this.pet.fillCircle(0, 0, layerRadius);
    }
    
    // Outer aura
    this.pet.fillStyle(auraColor, auraIntensity * 0.1);
    this.pet.fillCircle(0, 0, auraRadius2);
    
    // Draw pet body with gradient effect
    this.pet.fillStyle(bodyColor);
    this.pet.fillCircle(0, 0, 50);
    
    // Add inner glow
    this.pet.fillStyle(0xffffff, 0.2);
    this.pet.fillCircle(0, 0, 45);
    
    // Draw cosmic eyes
    this.pet.fillStyle(eyeColor);
    if (mood === 'sleepy') {
      // Closed eyes with cosmic sparkles
      this.pet.fillRect(-15, -10, 12, 4);
      this.pet.fillRect(3, -10, 12, 4);
      // Add sparkles
      this.pet.fillStyle(0xffffff);
      this.pet.fillCircle(-10, -8, 1);
      this.pet.fillCircle(8, -8, 1);
    } else {
      // Glowing cosmic eyes
      this.pet.fillCircle(-15, -10, 6);
      this.pet.fillCircle(15, -10, 6);
      
      // Add white pupils for glow effect
      this.pet.fillStyle(0xffffff);
      this.pet.fillCircle(-15, -10, 3);
      this.pet.fillCircle(15, -10, 3);
      
      // Add tiny sparkles
      this.pet.fillCircle(-13, -12, 1);
      this.pet.fillCircle(17, -12, 1);
    }
    
    // Draw cosmic mouth
    this.pet.lineStyle(3, eyeColor);
    if (mouthCurve > 0) {
      // Cosmic smile with sparkles
      this.pet.beginPath();
      this.pet.arc(0, 10, 15, 0.2, Math.PI - 0.2);
      this.pet.strokePath();
      
      // Add sparkles around smile
      this.pet.fillStyle(0xffffff);
      this.pet.fillCircle(-12, 18, 1);
      this.pet.fillCircle(12, 18, 1);
    } else if (mouthCurve < 0) {
      // Cosmic frown
      this.pet.beginPath();
      this.pet.arc(0, 25, 15, Math.PI + 0.2, 2 * Math.PI - 0.2);
      this.pet.strokePath();
    } else {
      // Neutral cosmic mouth
      this.pet.strokeRect(-10, 15, 20, 3);
    }
    
    // Add evolutionary features - more particles and complexity for higher stages
    const particleCount = Math.max(5, evolutionStage * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 60 + Math.sin(Date.now() / 1000 + i) * (evolutionStage * 3);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const particleSize = 1 + (evolutionStage * 0.5);
      this.pet.fillStyle(auraColor, auraIntensity);
      this.pet.fillCircle(x, y, particleSize);
      
      // Add sparkles for higher evolution stages
      if (evolutionStage >= 3) {
        const sparkleX = x + Math.sin(Date.now() / 500) * 5;
        const sparkleY = y + Math.cos(Date.now() / 500) * 5;
        this.pet.fillStyle(0xffffff, 0.8);
        this.pet.fillCircle(sparkleX, sparkleY, 0.5);
      }
    }
    
    // Special effects for maximum evolution
    if (evolutionStage >= 5) {
      // Cosmic master effects - rotating rings
      const time = Date.now() / 1000;
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = 80 + (ring * 20);
        for (let p = 0; p < 8; p++) {
          const angle = (p / 8) * Math.PI * 2 + (time * (ring + 1) * 0.5);
          const x = Math.cos(angle) * ringRadius;
          const y = Math.sin(angle) * ringRadius;
          
          this.pet.fillStyle(0xffffff, 0.6);
          this.pet.fillCircle(x, y, 1);
        }
      }
    }
  }

  // Helper functions for color manipulation
  darkenColor(color, factor) {
    const r = Math.floor(((color >> 16) & 0xFF) * factor);
    const g = Math.floor(((color >> 8) & 0xFF) * factor);
    const b = Math.floor((color & 0xFF) * factor);
    return (r << 16) | (g << 8) | b;
  }

  blendColors(color1, color2, ratio) {
    const r1 = (color1 >> 16) & 0xFF;
    const g1 = (color1 >> 8) & 0xFF;
    const b1 = color1 & 0xFF;
    
    const r2 = (color2 >> 16) & 0xFF;
    const g2 = (color2 >> 8) & 0xFF;
    const b2 = color2 & 0xFF;
    
    const r = Math.floor(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.floor(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.floor(b1 * (1 - ratio) + b2 * ratio);
    
    return (r << 16) | (g << 8) | b;
  }

  createUI() {
    // Cosmic stats display
    this.statsText = this.add.text(15, 15, '', {
      fontSize: '14px',
      fill: '#e0e7ff',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      padding: { x: 12, y: 8 },
      stroke: '#8b5cf6',
      strokeThickness: 1
    });

    // Cosmic mood indicator
    this.moodIndicator = this.add.text(15, 75, '', {
      fontSize: '16px',
      fill: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      padding: { x: 12, y: 8 },
      stroke: '#06b6d4',
      strokeThickness: 1
    });

    // Space instructions
    this.add.text(this.cameras.main.centerX, this.cameras.main.height - 25, 
      '✨ Click your cosmic companion to interact! ✨', {
      fontSize: '16px',
      fill: '#e0e7ff',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: { x: 15, y: 8 },
      stroke: '#8b5cf6',
      strokeThickness: 2
    }).setOrigin(0.5);
  }

  setupAnimations() {
    // Idle floating animation
    this.tweens.add({
      targets: this.pet,
      y: this.pet.y - 10,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  petClicked() {
    // Pet response to click
    this.showFloatingText('❤️', this.pet.x, this.pet.y - 70);
    
    // Bounce animation
    this.tweens.add({
      targets: this.pet,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      ease: 'Power2',
      yoyo: true
    });

    // Add some velocity for physics fun
    if (this.pet.body) {
      this.pet.body.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-200, -100)
      );
    }
  }

  showFloatingText(text, x, y) {
    const floatingText = this.add.text(x, y, text, {
      fontSize: '24px',
      fill: '#FFD700'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: floatingText,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        floatingText.destroy();
      }
    });
  }

  update() {
    // This method is called every frame
    // Update pet state based on current stats
    if (this.scene.settings.data && this.scene.settings.data.petStats) {
      this.updateGameState(this.scene.settings.data.petStats);
    }

    // Handle interactions from parent
    if (this.scene.settings.data && this.scene.settings.data.interactions) {
      this.handleInteractions(this.scene.settings.data.interactions);
    }
  }

  updateGameState(stats) {
    // Update stats display
    
    // Determine mood based on stats
    let newMood = 'neutral';
    
    if (stats.isDead) {
      newMood = 'dead';
    } else if (stats.health < 30) {
      newMood = 'sick';
    } else if (stats.hunger < 20) {
      newMood = 'hungry';
    } else if (stats.energy < 20) {
      newMood = 'sleepy';
    } else if (stats.happiness > 80) {
      newMood = 'happy';
    } else if (stats.happiness < 30) {
      newMood = 'sad';
    }

    // Update mood indicator with evolution and life stage info
    const moodEmojis = {
      happy: '😄',
      sad: '😢',
      angry: '😠',
      sleepy: '😴',
      hungry: '🤤',
      sick: '🤒',
      dead: '💀',
      neutral: '😐'
    };

    const lifeStageEmojis = {
      baby: '👶',
      child: '🧒',
      teen: '👦',
      adult: '👨',
      elder: '👴'
    };

    const evolutionStars = '⭐'.repeat(Math.min(5, stats.evolutionStage || 1));

    const moodText = [
      `${moodEmojis[newMood]} ${newMood.charAt(0).toUpperCase() + newMood.slice(1)}`,
      `${lifeStageEmojis[stats.lifeStage || 'baby']} ${stats.lifeStage || 'Baby'} (${stats.age || 0}d)`,
      `${evolutionStars} Evolution ${stats.evolutionStage || 1}`
    ];
    

    // Update pet appearance if mood changed
    if (newMood !== this.currentMood) {
      this.updatePetAppearance(newMood);
    }
  }

  handleInteractions(interactions) {
    // Handle new interactions (like feeding, playing, etc.)
    if (interactions.length > this.lastInteractionCount) {
      const newInteractions = interactions.slice(this.lastInteractionCount);
      
      newInteractions.forEach(interaction => {
        this.showInteractionEffect(interaction);
      });
      
      this.lastInteractionCount = interactions.length;
    }
  }

  showInteractionEffect(interaction) {
    const effectEmojis = {
      feed: '🍎',
      play: '🎾',
      sleep: '💤',
      pet: '❤️'
    };

    const emoji = effectEmojis[interaction.action] || '✨';
    this.showFloatingText(emoji, this.pet.x + 30, this.pet.y - 30);

    // Special effects based on action
    switch (interaction.action) {
      case 'feed':
        this.showFloatingText('+20 Hunger', this.pet.x, this.pet.y + 60);
        break;
      case 'play':
        this.showFloatingText('+15 Happiness', this.pet.x, this.pet.y + 60);
        break;
      case 'sleep':
        this.showFloatingText('+30 Energy', this.pet.x, this.pet.y + 60);
        break;
    }
  }
}