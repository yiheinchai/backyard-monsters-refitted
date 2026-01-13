import MovieClip from "openfl/display/MovieClip";
import { AssetRegistry } from "./AssetRegistry";

/**
 * @Embed decorator - Replaces Flash's [Embed] metadata.
 * Automatically loads and initializes asset graphics for MovieClip classes.
 * 
 * @param source - Path to the asset source (e.g., "/_assets/assets.swf")
 * @param symbol - Symbol name to load (e.g., "popup_siegebrag")
 * 
 * @example
 * ```typescript
 * @Embed({ source: "/_assets/assets.swf", symbol: "popup_siegebrag" })
 * export class popup_siegebrag extends MovieClip {
 *     constructor() {
 *         super();
 *     }
 * }
 * ```
 */
export function Embed(options: { source: string; symbol: string }) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        // Store the symbol name on the class for reference
        (constructor as any).ASSET_SYMBOL = options.symbol;
        (constructor as any).ASSET_SOURCE = options.source;

        // Return a new class that extends the original
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                
                // Initialize the clip with its asset
                AssetRegistry.initializeClip(this as any, options.symbol);
            }
        } as T;
    };
}

/**
 * @EmbedImage decorator - For embedding static images (not MovieClips).
 * 
 * @example
 * ```typescript
 * @EmbedImage({ source: "/_assets/2174_isograss1_isograss1.jpg" })
 * export class isograss1 extends Bitmap {
 *     constructor() {
 *         super();
 *     }
 * }
 * ```
 */
export function EmbedImage(options: { source: string }) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        // Extract symbol name from source path
        const symbol = extractSymbolFromPath(options.source);
        (constructor as any).ASSET_SYMBOL = symbol;
        (constructor as any).ASSET_SOURCE = options.source;

        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                
                // Load bitmap data asynchronously
                if (symbol) {
                    AssetRegistry.loadBitmapData(symbol).then(bitmapData => {
                        if (bitmapData && (this as any).bitmapData !== undefined) {
                            (this as any).bitmapData = bitmapData;
                        }
                    });
                }
            }
        } as T;
    };
}

/**
 * Extract symbol name from a path like "/_assets/2174_isograss1_isograss1.jpg"
 */
function extractSymbolFromPath(path: string): string | null {
    const fileName = path.split('/').pop();
    if (!fileName) return null;
    
    const baseName = fileName.replace(/\.(png|jpg|jpeg|swf)$/i, '');
    
    // Try to extract symbol from pattern like "2174_isograss1_isograss1"
    const match = baseName.match(/^\d+_(.+)$/);
    if (match) {
        const fullName = match[1];
        const parts = fullName.split('_');
        const halfLen = Math.floor(parts.length / 2);
        if (halfLen > 0 && parts.slice(0, halfLen).join('_') === parts.slice(halfLen).join('_')) {
            return parts.slice(0, halfLen).join('_');
        }
        return fullName;
    }
    
    return baseName;
}

/**
 * Helper to get the asset symbol from a decorated class
 */
export function getAssetSymbol(cls: any): string | null {
    return cls.ASSET_SYMBOL || null;
}

/**
 * Helper to get the asset source from a decorated class
 */
export function getAssetSource(cls: any): string | null {
    return cls.ASSET_SOURCE || null;
}
