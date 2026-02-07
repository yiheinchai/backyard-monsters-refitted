import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";

import { SpriteData } from "./SpriteData";

// Lazy import to break circular dependency: SpriteSheetAnimation -> SPRITES -> ResurrectProjectile -> MAP -> BFOUNDATION -> GameObject -> SpriteSheetAnimation
function getSPRITES(): any { return require("../../../SPRITES").SPRITES; }

/**
 * Animated sprite using sprite sheet frames.
 */
export class SpriteSheetAnimation extends Bitmap {
    public totalFrames: number;
    public currentFrame: number = 0;
    public currentRow: number = 0;
    public isPlaying: boolean = false;
    public doesRepeat: boolean = false;
    public spriteData: SpriteData;

    constructor(spriteData: SpriteData, totalFrames: number) {
        super(new BitmapData(spriteData.width, spriteData.height, true, 0));
        this.spriteData = spriteData;
        this.totalFrames = totalFrames;
    }

    public play(): void {
        this.isPlaying = true;
    }

    public stop(): void {
        this.isPlaying = false;
    }

    public gotoAndPlay(frame: number): void {
        this.currentFrame = frame;
        this.isPlaying = true;
    }

    public gotoAndStop(frame: number): void {
        this.currentFrame = frame;
        this.isPlaying = false;
    }

    public update(): void {
        if (this.isPlaying) {
            this.currentFrame++;
            if (this.currentFrame > this.totalFrames) {
                this.animationComplete();
            }
        }
        this.render();
    }

    public render(): void {
        getSPRITES().GetFrame(this.bitmapData, this.spriteData, this.currentFrame % this.totalFrames, this.currentRow);
    }

    private animationComplete(): void {
        if (this.doesRepeat) {
            this.currentFrame = 0;
        }
    }
}
