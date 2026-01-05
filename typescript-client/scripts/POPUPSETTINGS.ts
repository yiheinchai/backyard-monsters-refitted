import DisplayObject from 'openfl/display/DisplayObject';
import { GLOBAL } from './GLOBAL';
import { GAME } from './GAME'; // Assuming GAME is converted or exists
// import gs.TweenLite;
// import gs.easing.Quad;

export class POPUPSETTINGS {
    private static _BOTTOM_PADDING: number = 100;

    constructor() {
    }

    public static AlignToCenter(param1: DisplayObject): void {
        param1.x = GLOBAL._SCREENCENTER.x;
        param1.y = GLOBAL._SCREENCENTER.y - POPUPSETTINGS._BOTTOM_PADDING;
        if (GAME._isSmallSize) {
            param1.y = GLOBAL._SCREENCENTER.y - POPUPSETTINGS._BOTTOM_PADDING / 2;
        }
    }

    public static AlignToUpperLeft(param1: DisplayObject, param2: boolean = false): void {
        param1.x = GLOBAL._SCREENCENTER.x - param1.width * 0.5;
        param1.y = GLOBAL._SCREENCENTER.y - POPUPSETTINGS._BOTTOM_PADDING - param1.height * 0.5;
        if (param2) {
            param1.y = GLOBAL._SCREENCENTER.y - param1.height * 0.5;
        }
    }

    public static ScaleUp(param1: DisplayObject): void {
        param1.scaleX = 0.9;
        param1.scaleY = 0.9;
        // TweenLite.to(param1, 0.2, { "scaleX": 1, "scaleY": 1, "ease": Quad.easeOut });
        param1.scaleX = 1;
        param1.scaleY = 1;
    }

    public static ScaleUpFromTopLeft(param1: DisplayObject): void {
        param1.scaleX = 0.9;
        param1.scaleY = 0.9;
        // TweenLite.to(param1, 0.2, { "transformAroundCenter": { "scale": 1 }, "ease": Quad.easeOut });
        param1.scaleX = 1;
        param1.scaleY = 1;
    }
}
