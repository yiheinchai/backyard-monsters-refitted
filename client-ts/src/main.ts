/**
 * Backyard Monsters TypeScript Client
 * Main entry point
 */

import { GAME } from '@/core/Game';
import { GLOBAL } from '@/core/Global';
import { POPUPS } from '@/ui/Popups';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[BYMR] Initializing Backyard Monsters Client...');
  
  try {
    // Initialize popups system
    POPUPS.Setup();
    
    // Refresh screen dimensions
    GLOBAL.RefreshScreen();
    
    // Initialize game
    await GAME.instance.init();
    
    console.log('[BYMR] Initialization complete');
  } catch (error) {
    console.error('[BYMR] Failed to initialize:', error);
    GLOBAL.errorMessage('Failed to initialize game: ' + (error as Error).message);
  }
});

// Expose for debugging
if (import.meta.env.DEV) {
  (window as unknown as { GAME: typeof GAME; GLOBAL: typeof GLOBAL }).GAME = GAME;
  (window as unknown as { GAME: typeof GAME; GLOBAL: typeof GLOBAL }).GLOBAL = GLOBAL;
}
