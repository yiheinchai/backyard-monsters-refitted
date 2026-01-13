import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Loader from "openfl/display/Loader";
import URLRequest from "openfl/net/URLRequest";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";

/**
 * AssetRegistry - Central registry for mapping symbol names to asset paths.
 * Replaces Flash [Embed] functionality with runtime asset loading.
 */
export class AssetRegistry {
    private static _instance: AssetRegistry | null = null;
    private static _assetMap: Map<string, string> = new Map();
    private static _cache: Map<string, BitmapData> = new Map();
    private static _basePath: string = "";
    
    /**
     * Initialize the asset registry with an asset map.
     * @param assetMap - Object mapping symbol names to relative file paths
     * @param basePath - Base path for assets (e.g., "../" or "/assets/")
     */
    public static initialize(assetMap: Record<string, string>, basePath: string = ""): void {
        AssetRegistry._basePath = basePath;
        AssetRegistry._assetMap.clear();
        for (const [symbol, path] of Object.entries(assetMap)) {
            AssetRegistry._assetMap.set(symbol, path);
        }
        console.log(`[AssetRegistry] Initialized with ${AssetRegistry._assetMap.size} assets`);
    }

    /**
     * Register a single asset.
     */
    public static registerAsset(symbolName: string, path: string): void {
        AssetRegistry._assetMap.set(symbolName, path);
    }

    /**
     * Get the file path for a symbol name.
     */
    public static getAssetPath(symbolName: string): string | null {
        const path = AssetRegistry._assetMap.get(symbolName);
        if (path) {
            return AssetRegistry._basePath + path;
        }
        
        // Try variations of the symbol name
        const variations = [
            symbolName,
            symbolName.replace(/\./g, "_"),
            symbolName.replace(/_/g, "."),
        ];
        
        for (const variation of variations) {
            const found = AssetRegistry._assetMap.get(variation);
            if (found) {
                return AssetRegistry._basePath + found;
            }
        }
        
        return null;
    }

    /**
     * Check if an asset is registered.
     */
    public static hasAsset(symbolName: string): boolean {
        return AssetRegistry._assetMap.has(symbolName);
    }

    /**
     * Load a BitmapData from the registry.
     */
    public static async loadBitmapData(symbolName: string): Promise<BitmapData | null> {
        // Check cache first
        const cached = AssetRegistry._cache.get(symbolName);
        if (cached) {
            return cached;
        }

        const path = AssetRegistry.getAssetPath(symbolName);
        if (!path) {
            console.warn(`[AssetRegistry] Asset not found: ${symbolName}`);
            return null;
        }

        return AssetLoader.loadBitmapData(path);
    }

    /**
     * Load a Bitmap from the registry.
     */
    public static async loadBitmap(symbolName: string): Promise<Bitmap | null> {
        const bitmapData = await AssetRegistry.loadBitmapData(symbolName);
        if (bitmapData) {
            return new Bitmap(bitmapData);
        }
        return null;
    }

    /**
     * Initialize a MovieClip with its asset graphics.
     * This is called from MovieClip subclass constructors.
     */
    public static initializeClip(clip: MovieClip, symbolName: string): void {
        const path = AssetRegistry.getAssetPath(symbolName);
        if (path) {
            AssetLoader.loadIntoClip(clip, path);
        }
    }

    /**
     * Get all registered symbol names.
     */
    public static getRegisteredSymbols(): string[] {
        return Array.from(AssetRegistry._assetMap.keys());
    }

    /**
     * Clear the asset cache.
     */
    public static clearCache(): void {
        AssetRegistry._cache.clear();
    }
}

/**
 * AssetLoader - Utility class for loading assets using OpenFL.
 */
export class AssetLoader {
    /**
     * Load a BitmapData from a URL.
     */
    public static loadBitmapData(url: string): Promise<BitmapData | null> {
        return new Promise((resolve, reject) => {
            const loader = new Loader();
            
            loader.contentLoaderInfo.addEventListener(Event.COMPLETE, () => {
                const bitmap = loader.content as Bitmap;
                if (bitmap && bitmap.bitmapData) {
                    resolve(bitmap.bitmapData);
                } else {
                    resolve(null);
                }
            });
            
            loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (e: IOErrorEvent) => {
                console.warn(`[AssetLoader] Failed to load: ${url}`, e.text);
                resolve(null);
            });
            
            loader.load(new URLRequest(url));
        });
    }

    /**
     * Load a Bitmap from a URL.
     */
    public static async loadBitmap(url: string): Promise<Bitmap | null> {
        const bitmapData = await AssetLoader.loadBitmapData(url);
        if (bitmapData) {
            return new Bitmap(bitmapData);
        }
        return null;
    }

    /**
     * Load graphics into a MovieClip.
     * For sprites with multiple frames, this loads the first frame.
     */
    public static loadIntoClip(clip: MovieClip, path: string): void {
        const loader = new Loader();
        
        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, () => {
            clip.addChild(loader.content);
        });
        
        loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (e: IOErrorEvent) => {
            console.warn(`[AssetLoader] Failed to load clip asset: ${path}`, e.text);
        });
        
        // Try to load the first frame image
        const framePath = path.endsWith("/") ? `${path}1.png` : `${path}/1.png`;
        loader.load(new URLRequest(framePath));
    }

    /**
     * Load multiple frames for an animated MovieClip.
     */
    public static async loadFrames(basePath: string, frameCount: number): Promise<BitmapData[]> {
        const frames: BitmapData[] = [];
        
        for (let i = 1; i <= frameCount; i++) {
            const framePath = `${basePath}/${i}.png`;
            const bitmapData = await AssetLoader.loadBitmapData(framePath);
            if (bitmapData) {
                frames.push(bitmapData);
            }
        }
        
        return frames;
    }
}
