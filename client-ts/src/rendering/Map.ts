/**
 * MAP - Map rendering system for the Backyard Monsters client
 * This is the TypeScript equivalent of MAP.as
 */

// import { GLOBAL } from '@/core/Global';
// import { GAME } from '@/core/Game';
import { BASE } from "@/game/Base";
import { Point } from "@/types";

interface MapLayer {
  name: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  visible: boolean;
  zIndex: number;
}

/**
 * MAP class - handles isometric map rendering
 */
export class MAP {
  // Map dimensions
  static _mapWidth: number = 800;
  static _mapHeight: number = 800;

  // Tile size (isometric)
  static _tileWidth: number = 40;
  static _tileHeight: number = 20;

  // Map offset (for scrolling)
  static _offsetX: number = 0;
  static _offsetY: number = 0;

  // Zoom level
  static _zoom: number = 1;

  // Map layers
  private static layers: Map<string, MapLayer> = new Map();

  // Container element
  private static container: HTMLDivElement | null = null;

  // Ground layer reference
  static _GROUND: MapLayer | null = null;

  // Building layers
  static _BUILDINGBASE: MapLayer | null = null;
  static _BUILDINGTOPS: MapLayer | null = null;

  // Singleton instance
  static instance: MAP = new MAP();

  /**
   * Initialize the map
   */
  static Setup(): void {
    MAP.createContainer();
    MAP.createLayers();
    MAP.setupEventHandlers();
    MAP.centerMap();
  }

  /**
   * Create the container element
   */
  private static createContainer(): void {
    MAP.container = document.createElement("div");
    MAP.container.id = "map-container";
    MAP.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `;

    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.appendChild(MAP.container);
    }
  }

  /**
   * Create map layers
   */
  private static createLayers(): void {
    // Ground layer
    MAP._GROUND = MAP.createLayer("ground", 0);

    // Building base layer
    MAP._BUILDINGBASE = MAP.createLayer("buildingBase", 10);

    // Building tops layer
    MAP._BUILDINGTOPS = MAP.createLayer("buildingTops", 20);

    // Effects layer
    MAP.createLayer("effects", 30);

    // UI overlay layer
    MAP.createLayer("overlay", 40);
  }

  /**
   * Create a single layer
   */
  private static createLayer(name: string, zIndex: number): MapLayer {
    const canvas = document.createElement("canvas");
    canvas.id = `layer-${name}`;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      z-index: ${zIndex};
    `;

    const ctx = canvas.getContext("2d")!;

    const layer: MapLayer = {
      name,
      canvas,
      ctx,
      visible: true,
      zIndex,
    };

    MAP.layers.set(name, layer);

    if (MAP.container) {
      MAP.container.appendChild(canvas);
    }

    return layer;
  }

  /**
   * Setup event handlers for map interaction
   */
  private static setupEventHandlers(): void {
    if (!MAP.container) return;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // Mouse down
    MAP.container.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      MAP.container!.style.cursor = "grabbing";
    });

    // Mouse move
    MAP.container.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      MAP._offsetX += dx;
      MAP._offsetY += dy;

      lastX = e.clientX;
      lastY = e.clientY;

      MAP.render();
    });

    // Mouse up
    window.addEventListener("mouseup", () => {
      isDragging = false;
      if (MAP.container) {
        MAP.container.style.cursor = "grab";
      }
    });

    // Mouse wheel for zoom
    MAP.container.addEventListener("wheel", (e) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(2, MAP._zoom + delta));

      if (newZoom !== MAP._zoom) {
        MAP._zoom = newZoom;
        MAP.render();
      }
    });

    // Window resize
    window.addEventListener("resize", () => {
      MAP.resizeViewRect();
    });

    MAP.container.style.cursor = "grab";
  }

  /**
   * Center the map view
   */
  static centerMap(): void {
    MAP._offsetX = window.innerWidth / 2;
    MAP._offsetY = window.innerHeight / 4;
    MAP.render();
  }

  /**
   * Resize all layers
   */
  static resizeViewRect(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    MAP.layers.forEach((layer) => {
      layer.canvas.width = width;
      layer.canvas.height = height;
    });

    MAP.render();
  }

  /**
   * Render the map
   */
  static render(): void {
    MAP.clearLayers();
    MAP.renderGround();
    MAP.renderBuildings();
  }

  /**
   * Clear all layers
   */
  private static clearLayers(): void {
    MAP.layers.forEach((layer) => {
      layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    });
  }

  /**
   * Render ground tiles
   */
  private static renderGround(): void {
    if (!MAP._GROUND) return;

    const ctx = MAP._GROUND.ctx;
    const zoom = MAP._zoom;
    const offsetX = MAP._offsetX;
    const offsetY = MAP._offsetY;

    const tileW = MAP._tileWidth * zoom;
    const tileH = MAP._tileHeight * zoom;

    // Draw isometric grid
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.lineWidth = 1;

    const gridSize = 20;
    const startX = -gridSize;
    const endX = gridSize;
    const startY = -gridSize;
    const endY = gridSize;

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const isoPos = MAP.cartToIso(x * MAP._tileWidth, y * MAP._tileWidth);
        const screenX = isoPos.x * zoom + offsetX;
        const screenY = isoPos.y * zoom + offsetY;

        // Draw diamond tile
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - tileH / 2);
        ctx.lineTo(screenX + tileW / 2, screenY);
        ctx.lineTo(screenX, screenY + tileH / 2);
        ctx.lineTo(screenX - tileW / 2, screenY);
        ctx.closePath();

        // Fill with grass color
        ctx.fillStyle = `hsl(${120 + Math.random() * 10}, 40%, ${
          30 + Math.random() * 5
        }%)`;
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  /**
   * Render buildings
   */
  private static renderBuildings(): void {
    if (!MAP._BUILDINGBASE || !BASE._baseData) return;

    const ctx = MAP._BUILDINGBASE.ctx;
    const zoom = MAP._zoom;
    const offsetX = MAP._offsetX;
    const offsetY = MAP._offsetY;

    BASE._baseData.forEach((building: any) => {
      // Assume building has x, y, type
      const x = building.x || 0;
      const y = building.y || 0;
      const type = building.type || "unknown";

      // Convert to isometric
      const isoPos = MAP.cartToIso(x, y);
      const screenX = isoPos.x * zoom + offsetX;
      const screenY = isoPos.y * zoom + offsetY;

      // Draw building as a colored rectangle
      ctx.fillStyle = MAP.getBuildingColor(type);
      ctx.fillRect(screenX - 20, screenY - 20, 40, 40);

      // Draw border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX - 20, screenY - 20, 40, 40);

      // Draw type text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(type, screenX, screenY + 5);
    });
  }

  /**
   * Get building color based on type
   */
  private static getBuildingColor(type: string): string {
    const colors: Record<string, string> = {
      hq: "#8B4513",
      barracks: "#696969",
      goldmine: "#FFD700",
      sawmill: "#228B22",
      farm: "#32CD32",
      tower: "#DC143C",
      trap: "#FF6347",
      decoration: "#9370DB",
    };
    return colors[type] || "#4CAF50";
  }

  /**
   * Convert cartesian coordinates to isometric
   */
  static cartToIso(x: number, y: number): Point {
    return {
      x: x - y,
      y: (x + y) / 2,
    };
  }

  /**
   * Convert isometric coordinates to cartesian
   */
  static isoToCart(isoX: number, isoY: number): Point {
    return {
      x: isoX / 2 + isoY,
      y: isoY - isoX / 2,
    };
  }

  /**
   * Convert screen coordinates to tile coordinates
   */
  static screenToTile(screenX: number, screenY: number): Point {
    const localX = (screenX - MAP._offsetX) / MAP._zoom;
    const localY = (screenY - MAP._offsetY) / MAP._zoom;

    const cart = MAP.isoToCart(localX, localY);

    return {
      x: Math.floor(cart.x / MAP._tileWidth),
      y: Math.floor(cart.y / MAP._tileWidth),
    };
  }

  /**
   * Convert tile coordinates to screen coordinates
   */
  static tileToScreen(tileX: number, tileY: number): Point {
    const cartX = tileX * MAP._tileWidth;
    const cartY = tileY * MAP._tileWidth;

    const isoPos = MAP.cartToIso(cartX, cartY);

    return {
      x: isoPos.x * MAP._zoom + MAP._offsetX,
      y: isoPos.y * MAP._zoom + MAP._offsetY,
    };
  }

  /**
   * Focus on a specific position
   */
  static Focus(x: number, y: number): void {
    const screenPos = MAP.tileToScreen(x, y);
    MAP._offsetX = window.innerWidth / 2 - screenPos.x + MAP._offsetX;
    MAP._offsetY = window.innerHeight / 2 - screenPos.y + MAP._offsetY;
    MAP.render();
  }

  /**
   * Focus with animation
   */
  static FocusTo(x: number, y: number, duration: number = 0.4): void {
    const targetPos = MAP.tileToScreen(x, y);
    const targetOffsetX = window.innerWidth / 2 - targetPos.x + MAP._offsetX;
    const targetOffsetY = window.innerHeight / 2 - targetPos.y + MAP._offsetY;

    const startX = MAP._offsetX;
    const startY = MAP._offsetY;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      MAP._offsetX = startX + (targetOffsetX - startX) * eased;
      MAP._offsetY = startY + (targetOffsetY - startY) * eased;

      MAP.render();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Sort depth (for overlapping objects)
   */
  static SortDepth(): void {
    // TODO: Implement depth sorting for buildings/objects
  }

  /**
   * Get layer by name
   */
  static getLayer(name: string): MapLayer | undefined {
    return MAP.layers.get(name);
  }

  /**
   * Set layer visibility
   */
  static setLayerVisible(name: string, visible: boolean): void {
    const layer = MAP.layers.get(name);
    if (layer) {
      layer.visible = visible;
      layer.canvas.style.display = visible ? "block" : "none";
    }
  }
}

export default MAP;
