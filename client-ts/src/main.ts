/**
 * Backyard Monsters Refitted - TypeScript Client
 * Main entry point
 */

import { game } from './core/Game';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Backyard Monsters Refitted - TypeScript Client');
  console.log('Initializing...');
  
  try {
    await game.init();
    console.log('Game initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    
    // Show error to user
    const loadingStatus = document.getElementById('loading-status');
    if (loadingStatus) {
      loadingStatus.textContent = `Error: ${error}`;
      loadingStatus.style.color = '#ff4444';
    }
  }
});

// Handle window unload
window.addEventListener('beforeunload', () => {
  // Save game state if needed
  if (game.base && game.state.mode === 'build') {
    game.base.save();
  }
});

// Handle visibility change (pause/resume when tab is hidden)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Game tab is hidden
    game.soundManager.pauseMusic();
  } else {
    // Game tab is visible again
    game.soundManager.resumeMusic();
    game.updateActivity();
  }
});

// Prevent default drag behavior on the document
document.addEventListener('dragstart', (e) => e.preventDefault());

// Export for debugging
(window as unknown as { game: typeof game }).game = game;
