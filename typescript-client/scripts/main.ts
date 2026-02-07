/**
 * Main entry point for Backyard Monsters Refitted client.
 * Bootstraps OpenFL and renders the isometric base.
 * 
 * Two rendering modes:
 * 1. Standalone IsometricRenderer (no circular dep issues)
 * 2. Full GAME class (requires all circular deps resolved)
 */

// MUST be first import: establishes correct module initialization order
import './modulePreload';

import Stage from 'openfl/display/Stage';
import { initAssets } from './core/initAssets';
import { bootstrapRenderer } from './IsometricRenderer';

// Initialize the asset registry
initAssets();

/**
 * Try to bootstrap the full game. Falls back to standalone renderer on failure.
 */
function bootstrap(): void {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error('[BYMR] No game-container element found');
        return;
    }

    try {
        // Create OpenFL stage
        const stage = new Stage(760, 670, 0x1a472a, null, {
            element: container,
            context: { type: 'canvas' },
        });
        console.log('[BYMR] Stage created');

        // Try loading the full game
        try {
            const { GAME } = require('./GAME');
            const game = new GAME();
            stage.addChild(game);
            console.log('[BYMR] Full game loaded successfully');
        } catch (gameError: any) {
            console.warn('[BYMR] Full game failed to load:', gameError.message);
            console.log('[BYMR] Falling back to standalone isometric renderer');
            // Render the standalone isometric base as fallback
            bootstrapRenderer();
        }
    } catch (e: any) {
        console.error('[BYMR] Bootstrap error:', e.message, e.stack);
        // Ultimate fallback: standalone renderer without Stage
        bootstrapRenderer();
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}

