/**
 * Standalone isometric base renderer for Backyard Monsters Refitted.
 * 
 * This module directly renders the isometric map with buildings
 * without loading the full game. It demonstrates:
 * 1. OpenFL Stage initialization
 * 2. Isometric grid rendering (grass tiles)
 * 3. Building placement and rendering
 * 4. Asset loading pipeline
 */
import Stage from 'openfl/display/Stage';
import Sprite from 'openfl/display/Sprite';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import Shape from 'openfl/display/Shape';
import Graphics from 'openfl/display/Graphics';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';

// Game constants
const TILE_WIDTH = 40;      // Isometric tile width
const TILE_HEIGHT = 20;     // Isometric tile height
const MAP_WIDTH = 100;      // Grid width
const MAP_HEIGHT = 100;     // Grid height
const VISIBLE_TILES = 30;   // Tiles visible in viewport
const STAGE_WIDTH = 760;
const STAGE_HEIGHT = 670;

// Building definitions (type, name, gridX, gridY, size)
const SAMPLE_BUILDINGS = [
    { name: "Town Hall", gridX: 48, gridY: 48, size: 4, color: 0xCCAA00 },
    { name: "Hatchery", gridX: 44, gridY: 44, size: 3, color: 0x8B4513 },
    { name: "Resource Harvester", gridX: 52, gridY: 44, size: 2, color: 0x228B22 },
    { name: "Silo", gridX: 44, gridY: 52, size: 2, color: 0x4169E1 },
    { name: "Tower 1", gridX: 40, gridY: 48, size: 2, color: 0x808080 },
    { name: "Tower 2", gridX: 55, gridY: 48, size: 2, color: 0x808080 },
    { name: "Tower 3", gridX: 48, gridY: 42, size: 2, color: 0x808080 },
    { name: "Tower 4", gridX: 48, gridY: 55, size: 2, color: 0x808080 },
    { name: "Housing", gridX: 53, gridY: 52, size: 2, color: 0xDAA520 },
    { name: "Lab", gridX: 40, gridY: 44, size: 3, color: 0x9932CC },
    { name: "Map Room", gridX: 56, gridY: 50, size: 3, color: 0x2E8B57 },
    { name: "Monster Locker", gridX: 44, gridY: 56, size: 3, color: 0xDC143C },
];

/**
 * Convert grid coordinates to isometric screen coordinates.
 */
function gridToIso(gx: number, gy: number): { x: number; y: number } {
    return {
        x: (gx - gy) * (TILE_WIDTH / 2),
        y: (gx + gy) * (TILE_HEIGHT / 2),
    };
}

/**
 * Draw the isometric grass grid.
 */
function drawGrid(container: Sprite, offsetX: number, offsetY: number): void {
    const graphics: any = container.graphics;
    const startX = 35;
    const startY = 35;
    const endX = startX + VISIBLE_TILES;
    const endY = startY + VISIBLE_TILES;

    for (let gx = startX; gx < endX; gx++) {
        for (let gy = startY; gy < endY; gy++) {
            const iso = gridToIso(gx, gy);
            const sx = iso.x + offsetX;
            const sy = iso.y + offsetY;

            // Alternate grass colors for visual interest
            const isEvenTile = (gx + gy) % 2 === 0;
            const grassColor = isEvenTile ? 0x4CAF50 : 0x45A049;
            
            // Draw diamond-shaped tile
            graphics.beginFill(grassColor);
            graphics.lineStyle(1, 0x388E3C, 0.3);
            graphics.moveTo(sx, sy - TILE_HEIGHT / 2);
            graphics.lineTo(sx + TILE_WIDTH / 2, sy);
            graphics.lineTo(sx, sy + TILE_HEIGHT / 2);
            graphics.lineTo(sx - TILE_WIDTH / 2, sy);
            graphics.lineTo(sx, sy - TILE_HEIGHT / 2);
            graphics.endFill();
        }
    }
}

/**
 * Draw buildings on the isometric grid.
 */
function drawBuildings(container: Sprite, offsetX: number, offsetY: number): void {
    for (const building of SAMPLE_BUILDINGS) {
        const buildingSprite = new Sprite();
        const graphics: any = buildingSprite.graphics;
        
        const iso = gridToIso(building.gridX, building.gridY);
        const bx = iso.x + offsetX;
        const by = iso.y + offsetY;
        
        const tileW = TILE_WIDTH * building.size;
        const tileH = TILE_HEIGHT * building.size;
        const buildingHeight = 15 + building.size * 8;
        
        // Draw building shadow (darker footprint)
        graphics.beginFill(0x000000, 0.2);
        graphics.moveTo(bx, by - tileH / 2);
        graphics.lineTo(bx + tileW / 2, by);
        graphics.lineTo(bx, by + tileH / 2);
        graphics.lineTo(bx - tileW / 2, by);
        graphics.lineTo(bx, by - tileH / 2);
        graphics.endFill();
        
        // Draw building base (bottom face)
        graphics.beginFill(building.color, 0.9);
        graphics.lineStyle(1, 0x000000, 0.5);
        graphics.moveTo(bx, by - tileH / 2);
        graphics.lineTo(bx + tileW / 2, by);
        graphics.lineTo(bx, by + tileH / 2);
        graphics.lineTo(bx - tileW / 2, by);
        graphics.lineTo(bx, by - tileH / 2);
        graphics.endFill();
        
        // Draw building left side
        const darkerColor = darken(building.color, 0.7);
        graphics.beginFill(darkerColor, 0.9);
        graphics.lineStyle(1, 0x000000, 0.3);
        graphics.moveTo(bx - tileW / 2, by);
        graphics.lineTo(bx, by + tileH / 2);
        graphics.lineTo(bx, by + tileH / 2 - buildingHeight);
        graphics.lineTo(bx - tileW / 2, by - buildingHeight);
        graphics.lineTo(bx - tileW / 2, by);
        graphics.endFill();
        
        // Draw building right side
        const lighterColor = darken(building.color, 0.85);
        graphics.beginFill(lighterColor, 0.9);
        graphics.lineStyle(1, 0x000000, 0.3);
        graphics.moveTo(bx + tileW / 2, by);
        graphics.lineTo(bx, by + tileH / 2);
        graphics.lineTo(bx, by + tileH / 2 - buildingHeight);
        graphics.lineTo(bx + tileW / 2, by - buildingHeight);
        graphics.lineTo(bx + tileW / 2, by);
        graphics.endFill();
        
        // Draw building top face
        graphics.beginFill(building.color);
        graphics.lineStyle(1, 0x000000, 0.4);
        graphics.moveTo(bx, by - tileH / 2 - buildingHeight);
        graphics.lineTo(bx + tileW / 2, by - buildingHeight);
        graphics.lineTo(bx, by + tileH / 2 - buildingHeight);
        graphics.lineTo(bx - tileW / 2, by - buildingHeight);
        graphics.lineTo(bx, by - tileH / 2 - buildingHeight);
        graphics.endFill();
        
        container.addChild(buildingSprite);
    }
}

/**
 * Darken a color by a factor.
 */
function darken(color: number, factor: number): number {
    const r = Math.floor(((color >> 16) & 0xFF) * factor);
    const g = Math.floor(((color >> 8) & 0xFF) * factor);
    const b = Math.floor((color & 0xFF) * factor);
    return (r << 16) | (g << 8) | b;
}

/**
 * Bootstrap the OpenFL runtime and render the isometric base.
 */
export function bootstrapRenderer(): void {
    try {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('[BYMR] No game-container element found');
            return;
        }

        // Create OpenFL stage
        const stage = new Stage(STAGE_WIDTH, STAGE_HEIGHT, 0x1a472a, null, {
            element: container,
            context: { type: 'canvas' },
        });

        console.log('[BYMR] Stage created:', stage.stageWidth, 'x', stage.stageHeight);

        // Create rendering layers
        const groundLayer = new Sprite();
        const buildingLayer = new Sprite();

        stage.addChild(groundLayer);
        stage.addChild(buildingLayer);

        // Calculate camera offset to center the building cluster on screen
        // Center of building cluster is around grid (50, 50)
        const centerGridX = 50;
        const centerGridY = 50;
        const centerIso = gridToIso(centerGridX, centerGridY);
        const offsetX = STAGE_WIDTH / 2 - centerIso.x;
        const offsetY = STAGE_HEIGHT / 2 - centerIso.y;

        // Draw the isometric grid
        drawGrid(groundLayer, offsetX, offsetY);
        console.log('[BYMR] Grid rendered');

        // Draw buildings
        drawBuildings(buildingLayer, offsetX, offsetY);
        console.log('[BYMR] Buildings rendered');

        // Add title text overlay
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'position:absolute;top:10px;left:10px;color:#fff;font:bold 16px sans-serif;text-shadow:1px 1px 2px #000;pointer-events:none;z-index:10;';
        titleDiv.textContent = 'Backyard Monsters Refitted - Isometric Base Renderer';
        container.style.position = 'relative';
        container.appendChild(titleDiv);

        // Add building legend
        const legend = document.createElement('div');
        legend.style.cssText = 'position:absolute;bottom:10px;right:10px;color:#fff;font:12px sans-serif;text-shadow:1px 1px 2px #000;pointer-events:none;z-index:10;text-align:right;';
        legend.innerHTML = SAMPLE_BUILDINGS.map(b => 
            `<span style="color:#${b.color.toString(16).padStart(6,'0')}">■</span> ${b.name}`
        ).join('<br>');
        container.appendChild(legend);

        console.log('[BYMR] Isometric base renderer initialized successfully!');
    } catch (e: any) {
        console.error('[BYMR] Renderer error:', e.message, e.stack);
    }
}
