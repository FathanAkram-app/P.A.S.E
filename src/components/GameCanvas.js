import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import PetScene from '../game/PetScene';

const GameCanvas = ({ petStats, currentPet, petCount, onGameLoaded, interactions }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current,
      backgroundColor: '#0a0015',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: PetScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      audio: {
        disableWebAudio: true, // Disable Web Audio API to prevent context errors
        noAudio: true // Completely disable audio to prevent any audio context issues
      },
      // Disable audio context management by Phaser
      disableContextMenu: true
    };

    // Handle audio context errors
    const handleAudioContextError = (event) => {
      console.warn('Audio context error caught and handled:', event);
      // Prevent the error from propagating
      event.preventDefault();
      return false;
    };

    // Add error listeners
    window.addEventListener('error', handleAudioContextError);
    window.addEventListener('unhandledrejection', handleAudioContextError);

    try {
      // Create Phaser game instance
      phaserGameRef.current = new Phaser.Game(config);

      // Pass callback to scene
      const scene = phaserGameRef.current.scene.getScene('PetScene');
      if (scene) {
        scene.scene.settings.data = {
          onGameLoaded: onGameLoaded,
          petStats: petStats,
          interactions: interactions
        };
      }
    } catch (error) {
      console.warn('Phaser initialization error (audio context related):', error);
      // Game will still work without audio
    }

    // Cleanup function
    return () => {
      // Remove error listeners
      window.removeEventListener('error', handleAudioContextError);
      window.removeEventListener('unhandledrejection', handleAudioContextError);

      if (phaserGameRef.current) {
        try {
          // Properly destroy the game instance
          phaserGameRef.current.destroy(true, false);
          phaserGameRef.current = null;
        } catch (error) {
          console.warn('Game cleanup error (audio context related):', error);
          // Force null the reference even if cleanup fails
          phaserGameRef.current = null;
        }
      }
    };
  }, []); // Empty dependency array - only run once

  // Update scene data when props change
  useEffect(() => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('PetScene');
      if (scene && scene.scene.settings.data) {
        scene.scene.settings.data.petStats = petStats;
        scene.scene.settings.data.interactions = interactions;
      }
    }
  }, [petStats, interactions]);

  return (
    <div className="game-canvas-container">
      <div 
        ref={gameRef} 
        className="phaser-game"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
};

export default GameCanvas;