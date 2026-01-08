import { BitmapData } from "openfl/display/BitmapData";
import { MovieClip } from "openfl/display/MovieClip";
import { GlowFilter } from "openfl/filters/GlowFilter";

import { MovieClipUtils } from "../utils/MovieClipUtils";

// Declare external clip class
declare class FIREBALL_CLIP extends MovieClip {}

/**
 * Utility functions for projectile graphics creation.
 */
export class ProjectileUtils {
    public static readonly k_fireballSpeed: number = 6;
    public static readonly k_healballSpeed: number = 25;

    constructor() {}

    /**
     * Creates bitmap data for fireball projectile.
     */
    public static getFireballBitmapData(): BitmapData {
        const clip = new FIREBALL_CLIP();
        clip.scaleX = 2;
        clip.scaleY = 2;
        clip.stop();
        clip.filters = [new GlowFilter(0xFF9A00, 1, 12, 12, 6, 1, false, false)];
        return MovieClipUtils.getBitmapDataFromDisplayObject(clip);
    }

    /**
     * Creates bitmap data for heal ball projectile.
     */
    public static getHealballBitmapData(): BitmapData {
        const clip = new FIREBALL_CLIP();
        clip.gotoAndStop(2);
        clip.scaleX = 2;
        clip.scaleY = 2;
        return MovieClipUtils.getBitmapDataFromDisplayObject(clip);
    }

    /**
     * Creates bitmap data for Fomor fireball projectile.
     */
    public static getFomorballBitmapData(): BitmapData {
        const clip = new FIREBALL_CLIP();
        clip.gotoAndStop(3);
        clip.scaleX = 2;
        clip.scaleY = 2;
        return MovieClipUtils.getBitmapDataFromDisplayObject(clip);
    }
}
