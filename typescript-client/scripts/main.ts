/**
 * Main entry point for Backyard Monsters Refitted client.
 * Bootstraps OpenFL and initializes the GAME class.
 */
import Lib from 'openfl/Lib';
import Stage from 'openfl/display/Stage';
import Sprite from 'openfl/display/Sprite';
import { initAssets } from './core/initAssets';
import { GAME } from './GAME';

// Initialize the asset registry
initAssets();

/**
 * Bootstrap the OpenFL runtime and start the game.
 * OpenFL needs a Stage to be set up before we can render anything.
 */
function bootstrap(): void {
    try {
        // Create a canvas element for OpenFL to render to
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('[BYMR] No game-container element found');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 760;
        canvas.height = 670;
        canvas.id = 'openfl-canvas';
        container.appendChild(canvas);

        // Create stage from canvas
        const stage = new Stage(canvas.width, canvas.height, 0x333333, canvas);

        // Create root clip and add to stage
        const root = new Sprite();
        stage.addChild(root);

        // Expose Lib.current for OpenFL compatibility
        (Lib as any).__current = root;

        // Create and add the game
        const game = new GAME();
        root.addChild(game);

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

