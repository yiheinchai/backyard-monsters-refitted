/**
 * Asset Manager - Handles loading and caching of game assets
 * Ported from ActionScript ImageCache and related classes
 */

import { Assets, Texture, Spritesheet, type UnresolvedAsset } from 'pixi.js';
import { CONFIG } from '../core/config';

export interface AssetManifest {
  bundles: AssetBundle[];
}

export interface AssetBundle {
  name: string;
  assets: UnresolvedAsset[];
}

// Asset categories
export const ASSET_BUNDLES = {
  CORE: 'core',
  BUILDINGS: 'buildings',
  MONSTERS: 'monsters',
  UI: 'ui',
  EFFECTS: 'effects',
  SOUNDS: 'sounds',
  TERRAIN: 'terrain',
  WORLDMAP: 'worldmap',
} as const;

class AssetManager {
  private static instance: AssetManager;
  private assetsPath: string;
  private loadedBundles: Set<string> = new Set();
  private textureCache: Map<string, Texture> = new Map();
  private spritesheetCache: Map<string, Spritesheet> = new Map();

  private constructor() {
    this.assetsPath = `${CONFIG.CDN_URL}assets/`;
  }

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * Initialize the asset loader with manifest
   */
  async init(): Promise<void> {
    // Configure PixiJS assets
    Assets.init({
      basePath: this.assetsPath,
    });

    // Load the core manifest
    await this.loadManifest();
  }

  /**
   * Load the asset manifest
   */
  private async loadManifest(): Promise<void> {
    // Create bundles for different asset categories
    const manifest: AssetManifest = {
      bundles: [
        {
          name: ASSET_BUNDLES.CORE,
          assets: this.getCoreAssets(),
        },
        {
          name: ASSET_BUNDLES.TERRAIN,
          assets: this.getTerrainAssets(),
        },
        {
          name: ASSET_BUNDLES.UI,
          assets: this.getUIAssets(),
        },
        {
          name: ASSET_BUNDLES.BUILDINGS,
          assets: this.getBuildingAssets(),
        },
        {
          name: ASSET_BUNDLES.MONSTERS,
          assets: this.getMonsterAssets(),
        },
      ],
    };

    await Assets.init({ manifest });
  }

  /**
   * Get core game assets
   */
  private getCoreAssets(): UnresolvedAsset[] {
    return [
      // Frame assets
      { alias: 'frame1_top_left', src: 'ui/frame1_top_left.png' },
      { alias: 'frame1_top_middle', src: 'ui/frame1_top_middle.png' },
      { alias: 'frame1_top_right', src: 'ui/frame1_top_right.png' },
      { alias: 'frame1_bottom_left', src: 'ui/frame1_bottom_left.png' },
      { alias: 'frame1_bottom_middle', src: 'ui/frame1_bottom_middle.png' },
      { alias: 'frame1_bottom_right', src: 'ui/frame1_bottom_right.png' },
    ];
  }

  /**
   * Get terrain/background assets
   */
  private getTerrainAssets(): UnresolvedAsset[] {
    return [
      { alias: 'grass1', src: 'yardbg/isograss1.jpg' },
      { alias: 'grass2', src: 'yardbg/isograss2.png' },
      { alias: 'grass3', src: 'yardbg/isograss3.png' },
      { alias: 'grass4', src: 'yardbg/isograss4.png' },
      { alias: 'sand1', src: 'yardbg/isosand1.jpg' },
      { alias: 'sand2', src: 'yardbg/isosand2.jpg' },
      { alias: 'rock1', src: 'yardbg/isorock1.jpg' },
      { alias: 'rock2', src: 'yardbg/isorock2.jpg' },
      { alias: 'lava1', src: 'yardbg/inferno_lava1.jpg' },
      { alias: 'lava2', src: 'yardbg/inferno_lava2.jpg' },
    ];
  }

  /**
   * Get UI assets
   */
  private getUIAssets(): UnresolvedAsset[] {
    return [
      // Buttons
      { alias: 'btn_close', src: 'ui/button_close.png' },
      { alias: 'btn_help', src: 'ui/button_help.png' },
      // Icons
      { alias: 'icon_twig', src: 'ui/icon_twig.png' },
      { alias: 'icon_pebble', src: 'ui/icon_pebble.png' },
      { alias: 'icon_putty', src: 'ui/icon_putty.png' },
      { alias: 'icon_goo', src: 'ui/icon_goo.png' },
      { alias: 'icon_shiny', src: 'ui/icon_shiny.png' },
    ];
  }

  /**
   * Get building assets
   */
  private getBuildingAssets(): UnresolvedAsset[] {
    // Building thumbnails and sprites
    const assets: UnresolvedAsset[] = [];
    
    // Add building thumbnails
    for (let i = 1; i <= 27; i++) {
      assets.push({
        alias: `building${i}_thumb`,
        src: `buildingthumbs/building${i}.png`,
      });
    }

    // Add building sprites (these would be actual building images)
    for (let i = 1; i <= 27; i++) {
      assets.push({
        alias: `building${i}`,
        src: `buildings/building${i}.png`,
      });
    }

    return assets;
  }

  /**
   * Get monster assets
   */
  private getMonsterAssets(): UnresolvedAsset[] {
    const monsters = [
      'pokey', 'octoooze', 'bolt', 'fink', 'eyera',
      'ichi', 'crabatron', 'projectx', 'brain', 'teratorn',
      'wormzer', 'dave', 'zafreeti', 'korath',
    ];

    return monsters.map(monster => ({
      alias: `monster_${monster}`,
      src: `monsters/${monster}.png`,
    }));
  }

  /**
   * Load a specific bundle
   */
  async loadBundle(bundleName: string, onProgress?: (progress: number) => void): Promise<void> {
    if (this.loadedBundles.has(bundleName)) {
      return;
    }

    try {
      await Assets.loadBundle(bundleName, onProgress);
      this.loadedBundles.add(bundleName);
    } catch (error) {
      console.error(`Failed to load bundle: ${bundleName}`, error);
      // Don't throw - allow game to continue with missing assets
    }
  }

  /**
   * Load essential assets for game startup
   */
  async loadEssentialAssets(onProgress?: (progress: number) => void): Promise<void> {
    const essentialBundles = [ASSET_BUNDLES.CORE, ASSET_BUNDLES.TERRAIN, ASSET_BUNDLES.UI];
    
    let totalProgress = 0;
    const bundleProgress = 1 / essentialBundles.length;

    for (const bundle of essentialBundles) {
      await this.loadBundle(bundle, (progress) => {
        if (onProgress) {
          onProgress(totalProgress + progress * bundleProgress);
        }
      });
      totalProgress += bundleProgress;
    }
  }

  /**
   * Get a texture by alias
   */
  getTexture(alias: string): Texture | undefined {
    if (this.textureCache.has(alias)) {
      return this.textureCache.get(alias);
    }

    try {
      const texture = Assets.get<Texture>(alias);
      if (texture) {
        this.textureCache.set(alias, texture);
      }
      return texture;
    } catch {
      console.warn(`Texture not found: ${alias}`);
      return undefined;
    }
  }

  /**
   * Load a texture directly from URL
   */
  async loadTexture(url: string, alias?: string): Promise<Texture> {
    const fullUrl = url.startsWith('http') ? url : `${this.assetsPath}${url}`;
    const key = alias || url;

    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!;
    }

    try {
      const texture = await Assets.load<Texture>(fullUrl);
      this.textureCache.set(key, texture);
      return texture;
    } catch (error) {
      console.error(`Failed to load texture: ${url}`, error);
      throw error;
    }
  }

  /**
   * Check if a bundle is loaded
   */
  isBundleLoaded(bundleName: string): boolean {
    return this.loadedBundles.has(bundleName);
  }

  /**
   * Get building sprite for a specific building type and level
   */
  async getBuildingSprite(buildingType: number, level: number = 1): Promise<Texture | undefined> {
    const alias = `building${buildingType}_${level}`;
    
    // Try to get from cache first
    let texture = this.getTexture(alias);
    if (texture) return texture;

    // Try to load from server
    try {
      texture = await this.loadTexture(
        `buildings/building${buildingType}_lvl${level}.png`,
        alias
      );
      return texture;
    } catch {
      // Fall back to base building image
      return this.getTexture(`building${buildingType}`);
    }
  }

  /**
   * Get monster sprite
   */
  async getMonsterSprite(monsterType: number): Promise<Texture | undefined> {
    const alias = `monster_${monsterType}`;
    return this.getTexture(alias);
  }

  /**
   * Preload an image and return a promise
   */
  preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url.startsWith('http') ? url : `${this.assetsPath}${url}`;
    });
  }

  /**
   * Clear all cached assets
   */
  clearCache(): void {
    this.textureCache.clear();
    this.spritesheetCache.clear();
    this.loadedBundles.clear();
  }
}

// Export singleton instance
export const assets = AssetManager.getInstance();
