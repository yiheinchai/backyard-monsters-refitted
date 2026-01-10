import BitmapData from "openfl/display/BitmapData";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

/**
 * Sprite data container for sprite sheet frames.
 */
export class SpriteData {
    public static readonly FUBAR_X: number = 26;
    public static readonly FUBAR_Y: number = 36;

    public key: string;
    public image: BitmapData | null = null;
    public readonly rect: Rectangle = new Rectangle();
    public readonly offset: Point = new Point();
    public readonly middle: Point = new Point();

    constructor(key: string, width: number, height: number, middleX: number, middleY: number) {
        this.key = key;
        this.rect.width = width;
        this.rect.height = height;
        this.offset.x = SpriteData.FUBAR_X - middleX;
        this.offset.y = SpriteData.FUBAR_Y - middleY;
        this.middle.x = middleX;
        this.middle.y = middleY;
    }

    public get width(): number {
        return this.rect.width;
    }

    public get height(): number {
        return this.rect.height;
    }

    public get sprite(): BitmapData | null {
        return this.image;
    }
}
