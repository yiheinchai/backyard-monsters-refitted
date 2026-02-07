/**
 * Main entry point for Backyard Monsters Refitted client.
 * Bootstraps OpenFL and initializes the GAME class.
 * 
 * Webpack handles circular dependencies via CommonJS-style require()
 * which defers module resolution to runtime.
 */
import Stage from 'openfl/display/Stage';
import Sprite from 'openfl/display/Sprite';
import { initAssets } from './core/initAssets';
import { GAME } from './GAME';

// Initialize the asset registry
initAssets();

/**
 * Bootstrap the OpenFL runtime and start the game.
 */
function bootstrap(): void {
    try {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('[BYMR] No game-container element found');
            return;
        }

        // Create OpenFL stage using the proper Stage constructor
        // Stage(width, height, color, documentClass, windowAttributes)
        const stage = new Stage(760, 670, 0x333333, null, {
            element: container,
            context: { type: 'canvas' },
        });

        console.log('[BYMR] Stage created');

        const game = new GAME();
        stage.addChild(game);

        console.log('[BYMR] Game bootstrapped successfully');
        console.log('[BYMR] Stage size:', stage.stageWidth, 'x', stage.stageHeight);
    } catch (e: any) {
        console.error('[BYMR] Bootstrap error:', e.message, e.stack);
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}

