import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { Sprite } from "openfl/display/Sprite";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

import { pin_shadow } from "../../../pin_shadow";
import { pushpins } from "../../../pushpins";

/**
 * PushPin - creates colored push pins for map markers.
 */
export class PushPin {
    public static readonly GREEN: number = 0;
    public static readonly YELLOW: number = 1;
    public static readonly ORANGE: number = 2;
    public static readonly RED: number = 3;

    public static columnWidth: number = 21;
    public static columnHeight: number = 25;

    private static keys: Record<string, any> = {};
    private static pins: BitmapData | null = null;
    private static shadow: BitmapData | null = null;
    public static loaded: boolean = false;
    private static loads: number = 0;
    private static isSetup: boolean = false;

    constructor() {
    }

    public static Setup(): void {
        PushPin.keys = {
            "shadow": {
                "img": "maproom/pinshadow.png",
                "data": new pin_shadow(0, 0)
            },
            "pins": {
                "img": "maproom/pushpin.png",
                "data": new pushpins(0, 0)
            }
        };
        PushPin.isSetup = true;
    }

    public static getRandomPinWithColor(color: number): Sprite {
        if (!PushPin.isSetup) {
            PushPin.Setup();
        }
        const pinSprite: Sprite = new Sprite();
        const shadowBitmap: Bitmap = new Bitmap(PushPin.keys.shadow.data);
        pinSprite.addChild(shadowBitmap);
        const pinData: BitmapData = new BitmapData(PushPin.columnWidth, PushPin.columnHeight, true);
        const randomColumn: number = Math.floor(Math.random() * 5);
        shadowBitmap.x = 3 + Math.random() * 3;
        shadowBitmap.y = 3 + Math.random() * 3;
        pinData.copyPixels(PushPin.keys.pins.data, new Rectangle(PushPin.columnWidth * randomColumn, color * PushPin.columnHeight, PushPin.columnWidth, PushPin.columnHeight), new Point(0, 0));
        const pinBitmap: Bitmap = new Bitmap(pinData);
        pinSprite.addChild(pinBitmap);
        pinSprite.x = -8;
        return pinSprite;
    }
}
