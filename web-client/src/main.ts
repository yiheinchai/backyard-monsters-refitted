/**
 * Backyard Monsters Refitted - TypeScript Web Client
 * 
 * Main entry point for the browser-based game client
 * Converted from ActionScript Flash client
 */

import { GAME } from './core/Game';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🏠 Backyard Monsters Refitted - Web Client');
  console.log('Version: 1.0.0');
  
  try {
    await GAME.init();
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
});

// Export for debugging
declare global {
  interface Window {
    GAME: typeof GAME;
  }
}

window.GAME = GAME;
