/**
 * Main entry point for Backyard Monsters Refitted client.
 * 
 * Bootstraps OpenFL, sets up the display layer hierarchy,
 * and renders the isometric map using the original game engine.
 * 
 * We bypass LOGIN (which requires a server) and directly
 * initialize the MAP with grass terrain to demonstrate the
 * original isometric rendering engine working.
 */

// Phase 1: Force correct module initialization order
import './modulePreload';

import Stage from 'openfl/display/Stage';
import Sprite from 'openfl/display/Sprite';
import MovieClip from 'openfl/display/MovieClip';
import Rectangle from 'openfl/geom/Rectangle';
import Point from 'openfl/geom/Point';
import { initAssets } from './core/initAssets';

// Initialize the asset registry (maps symbol names to image paths)
initAssets();

/**
 * Bootstrap the original game engine.
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
        console.log('[BYMR] Stage created:', stage.stageWidth, 'x', stage.stageHeight);

        // Import game modules via require (deferred to avoid module-load-time issues)
        const { GLOBAL } = require('./GLOBAL');
        const { GAME } = require('./GAME');
        const { MAP } = require('./MAP');
        const { BASE } = require('./BASE');
        const { BYMConfig } = require('./com/monsters/configs/BYMConfig');

        // Create a root sprite and add to stage
        const game = new Sprite();
        stage.addChild(game);
        GAME._instance = game;

        // Set up the display layer hierarchy (mirrors GAME.Data())
        GLOBAL._ROOT = new MovieClip();
        game.addChild(GLOBAL._ROOT);
        // Force stage propagation
        (GLOBAL._ROOT as any).__stage = stage;

        GLOBAL._layerMap = GLOBAL._ROOT.addChild(new Sprite()) as Sprite;
        GLOBAL._layerUI = GLOBAL._ROOT.addChild(new Sprite()) as Sprite;
        GLOBAL._layerWindows = GLOBAL._ROOT.addChild(new Sprite()) as Sprite;
        GLOBAL._layerMessages = GLOBAL._ROOT.addChild(new Sprite()) as Sprite;
        GLOBAL._layerTop = GLOBAL._ROOT.addChild(new Sprite()) as Sprite;

        // Initialize screen dimensions
        GLOBAL._SCREENINIT = new Rectangle(0, 0, 760, 670);
        GLOBAL._SCREEN = new Rectangle(0, 0, 760, 670);
        GLOBAL._SCREENCENTER = new Point(380, 335);
        GLOBAL._SCREENHUD = new Point(0, 462);
        GLOBAL._SCREENHUDLEFT = new Point(0, 462);
        GLOBAL.DOES_USE_SCROLL = false;

        // Disable renderer mode so we use simple bitmap tiling
        BYMConfig.instance.RENDERER_ON = false;

        // Set a base seed for terrain generation
        BASE._baseSeed = 42;

        console.log('[BYMR] Display layers initialized');

        // Pre-load isograss images, then create MAP
        const grassImages: string[] = [
            '/images/2174_isograss1_isograss1.jpg',
            '/images/2175_isograss2_isograss2.png',
            '/images/2172_isograss3_isograss3.png',
            '/images/2173_isograss4_isograss4.png',
            '/images/2177_isograss5_isograss5.png',
            '/images/2178_isograss6_isograss6.png',
            '/images/2176_isograss7_isograss7.png',
        ];

        // Load all grass tile images
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => {
                    console.warn('[BYMR] Failed to load image:', src);
                    resolve(img); // resolve anyway with empty image
                };
                img.src = src;
            });
        };

        Promise.all(grassImages.map(loadImage)).then(images => {
            console.log('[BYMR] Grass tile images loaded:', images.filter(i => i.naturalWidth > 0).length, '/', images.length);

            // Store loaded images globally for MAPBG to use
            (window as any).__grassImages = images;

            // Create the MAP with grass terrain using the ORIGINAL engine
            try {
                const map = new MAP("grass");
                console.log('[BYMR] MAP created with grass terrain');
                console.log('[BYMR] MAP._GROUND:', MAP._GROUND ? 'created' : 'null');
                console.log('[BYMR] MAP._BGTILES:', MAP._BGTILES ? 'created' : 'null');

                // Center the view on screen
                if (MAP._GROUND) {
                    MAP._GROUND.x = 380;
                    MAP._GROUND.y = 335;
                }

                // Initialize building properties from YARD_PROPS
                const { YARD_PROPS } = require('./YARD_PROPS');
                GLOBAL._buildingProps = YARD_PROPS._yardProps;
                GLOBAL._mapWidth = 1000;
                GLOBAL._mapHeight = 500;

                // Place a building on the map using a Sprite with isometric diamond shape
                // This represents where a building would be placed in the original game
                const { GRID } = require('./GRID');
                const buildingSprite = new Sprite();
                
                // Position at isometric grid center
                const isoPos = GRID.ToISO(0, 0, 0);
                buildingSprite.x = isoPos.x;
                buildingSprite.y = isoPos.y;

                // Draw an isometric building (Town Hall style)
                const g = buildingSprite.graphics;
                
                // Shadow/footprint
                g.beginFill(0x333333, 0.3);
                g.moveTo(0, -40);
                g.lineTo(80, 0);
                g.lineTo(0, 40);
                g.lineTo(-80, 0);
                g.lineTo(0, -40);
                g.endFill();

                // Left wall
                g.beginFill(0x8B6914);
                g.moveTo(-80, 0);
                g.lineTo(0, 40);
                g.lineTo(0, -20);
                g.lineTo(-80, -60);
                g.lineTo(-80, 0);
                g.endFill();

                // Right wall
                g.beginFill(0xA67C28);
                g.moveTo(80, 0);
                g.lineTo(0, 40);
                g.lineTo(0, -20);
                g.lineTo(80, -60);
                g.lineTo(80, 0);
                g.endFill();

                // Top face (roof)
                g.beginFill(0xC89632);
                g.moveTo(0, -100);
                g.lineTo(80, -60);
                g.lineTo(0, -20);
                g.lineTo(-80, -60);
                g.lineTo(0, -100);
                g.endFill();

                // Roof edges
                g.lineStyle(1, 0xDDAA44);
                g.moveTo(0, -100);
                g.lineTo(80, -60);
                g.moveTo(0, -100);
                g.lineTo(-80, -60);

                // Add building to the BUILDINGBASES layer (original engine layer)
                if (MAP._BUILDINGBASES) {
                    MAP._BUILDINGBASES.addChild(buildingSprite);
                    console.log('[BYMR] Building placed at isometric position (0,0)');
                }

                console.log('[BYMR] Original isometric engine rendering grass with building!');
            } catch (mapError: any) {
                console.error('[BYMR] MAP creation error:', mapError.message);
                console.error('[BYMR] Stack:', mapError.stack);
            }
        });
    } catch (e: any) {
        console.error('[BYMR] Bootstrap error:', e.message);
        console.error('[BYMR] Stack:', e.stack);
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
