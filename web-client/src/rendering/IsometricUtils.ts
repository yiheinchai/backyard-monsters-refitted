/**
 * Isometric utilities for the game
 * Handles conversion between screen coordinates and isometric grid coordinates
 */

export interface IsoPoint {
  x: number;
  y: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

// Tile dimensions (from original game)
export const TILE_WIDTH = 40; // Original was 40 pixels wide
export const TILE_HEIGHT = 20; // Original was 20 pixels tall (half of width for isometric)

/**
 * Convert grid coordinates to screen coordinates
 */
export function gridToScreen(gridX: number, gridY: number): ScreenPoint {
  return {
    x: (gridX - gridY) * (TILE_WIDTH / 2),
    y: (gridX + gridY) * (TILE_HEIGHT / 2),
  };
}

/**
 * Convert screen coordinates to grid coordinates
 */
export function screenToGrid(screenX: number, screenY: number): IsoPoint {
  const gridX = (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2;
  const gridY = (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2;
  return { x: gridX, y: gridY };
}

/**
 * Snap screen coordinates to nearest grid position
 */
export function snapToGrid(screenX: number, screenY: number): ScreenPoint {
  const grid = screenToGrid(screenX, screenY);
  const snappedGrid = {
    x: Math.round(grid.x),
    y: Math.round(grid.y),
  };
  return gridToScreen(snappedGrid.x, snappedGrid.y);
}

/**
 * Get the bounding box for an isometric tile at a grid position
 */
export function getTileBounds(gridX: number, gridY: number): {
  top: ScreenPoint;
  right: ScreenPoint;
  bottom: ScreenPoint;
  left: ScreenPoint;
} {
  const center = gridToScreen(gridX, gridY);
  return {
    top: { x: center.x, y: center.y - TILE_HEIGHT / 2 },
    right: { x: center.x + TILE_WIDTH / 2, y: center.y },
    bottom: { x: center.x, y: center.y + TILE_HEIGHT / 2 },
    left: { x: center.x - TILE_WIDTH / 2, y: center.y },
  };
}

/**
 * Check if a screen point is within an isometric tile
 */
export function isPointInTile(
  screenX: number,
  screenY: number,
  tileGridX: number,
  tileGridY: number
): boolean {
  const grid = screenToGrid(screenX, screenY);
  const dx = Math.abs(grid.x - tileGridX);
  const dy = Math.abs(grid.y - tileGridY);
  return dx < 0.5 && dy < 0.5;
}

/**
 * Calculate depth for sorting (Z-order)
 * Objects with higher depths should be rendered on top
 */
export function calculateDepth(gridX: number, gridY: number, offsetY: number = 0): number {
  return (gridX + gridY) * 10 + offsetY;
}

/**
 * Sort function for isometric depth sorting
 */
export function sortByDepth<T extends { gridX: number; gridY: number }>(
  objects: T[]
): T[] {
  return objects.sort((a, b) => {
    const depthA = calculateDepth(a.gridX, a.gridY);
    const depthB = calculateDepth(b.gridX, b.gridY);
    return depthA - depthB;
  });
}

/**
 * Get tiles visible in a rectangle (for rendering optimization)
 */
export function getVisibleTiles(
  screenX: number,
  screenY: number,
  screenWidth: number,
  screenHeight: number,
  padding: number = 2
): Array<{ x: number; y: number }> {
  const topLeft = screenToGrid(screenX - TILE_WIDTH, screenY - TILE_HEIGHT);
  const bottomRight = screenToGrid(
    screenX + screenWidth + TILE_WIDTH,
    screenY + screenHeight + TILE_HEIGHT
  );

  const minX = Math.floor(topLeft.x) - padding;
  const minY = Math.floor(topLeft.y) - padding;
  const maxX = Math.ceil(bottomRight.x) + padding;
  const maxY = Math.ceil(bottomRight.y) + padding;

  const tiles: Array<{ x: number; y: number }> = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}

/**
 * Calculate distance between two grid points
 */
export function gridDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate Manhattan distance between two grid points
 * Useful for pathfinding
 */
export function manhattanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Get adjacent tiles (8 directions)
 */
export function getAdjacentTiles(
  gridX: number,
  gridY: number
): Array<{ x: number; y: number }> {
  const directions = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 },                    { x: 1, y: 0 },
    { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 },
  ];

  return directions.map(d => ({
    x: gridX + d.x,
    y: gridY + d.y,
  }));
}

/**
 * Get tiles in a radius (circle)
 */
export function getTilesInRadius(
  centerX: number,
  centerY: number,
  radius: number
): Array<{ x: number; y: number }> {
  const tiles: Array<{ x: number; y: number }> = [];
  const radiusSquared = radius * radius;

  for (let y = Math.floor(centerY - radius); y <= Math.ceil(centerY + radius); y++) {
    for (let x = Math.floor(centerX - radius); x <= Math.ceil(centerX + radius); x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy <= radiusSquared) {
        tiles.push({ x, y });
      }
    }
  }

  return tiles;
}

/**
 * Get tiles in a rectangle
 */
export function getTilesInRect(
  startX: number,
  startY: number,
  width: number,
  height: number
): Array<{ x: number; y: number }> {
  const tiles: Array<{ x: number; y: number }> = [];

  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}
