import { AssetRegistry } from "./AssetRegistry";
import { ASSET_MAP } from "./asset-map";

/**
 * Initialize the asset loading system.
 * Call this at application startup.
 * 
 * @param basePath - Base path for assets (default: "" for same-level loading)
 * 
 * @example
 * // In your main entry point:
 * import { initAssets } from "./core/initAssets";
 * initAssets();
 */
export function initAssets(basePath: string = ""): void {
    AssetRegistry.initialize(ASSET_MAP, basePath);
}

/**
 * Usage example for MovieClip classes with [Embed]:
 * 
 * ```typescript
 * // [Embed(source="/_assets/assets.swf", symbol="popup_siegebrag")]
 * export class popup_siegebrag extends MovieClip {
 *     public static readonly ASSET_SYMBOL = "popup_siegebrag";
 *     
 *     constructor() {
 *         super();
 *         // Optional: Initialize with asset graphics
 *         AssetRegistry.initializeClip(this, popup_siegebrag.ASSET_SYMBOL);
 *     }
 * }
 * ```
 */
export { AssetRegistry } from "./AssetRegistry";
