import BitmapData from "openfl/display/BitmapData";
import BlendMode from "openfl/display/BlendMode";
import GradientType from "openfl/display/GradientType";
import Sprite from "openfl/display/Sprite";
import BlurFilter from "openfl/filters/BlurFilter";
import ColorMatrixFilter from "openfl/filters/ColorMatrixFilter";
import ColorTransform from "openfl/geom/ColorTransform";
import Matrix from "openfl/geom/Matrix";
import Point from "openfl/geom/Point";
import { ColorMatrix } from "../../gskinner/geom/ColorMatrix";
import { Embed } from "../../../core/Embed";

declare var GLOBAL: any;
declare var POPUPS: any;

// [Embed(source="/_assets/assets.swf", symbol="screenshot_border1")]
declare class screenshot_border1 extends BitmapData { constructor(w: number, h: number); }
// [Embed(source="/_assets/assets.swf", symbol="screenshot_border2")]
declare class screenshot_border2 extends BitmapData { constructor(w: number, h: number); }
// [Embed(source="/_assets/assets.swf", symbol="screenshot_border3")]
declare class screenshot_border3 extends BitmapData { constructor(w: number, h: number); }

/**
 * screenshot - Screenshot capture and processing utility.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "screenshot_border1" })
export class screenshot {
    public static _rawImage: BitmapData;
    public static _processedImage: BitmapData;

    constructor() { }

    public static Take(offsetX: number, offsetY: number): void {
        screenshot._rawImage = new BitmapData(700, 460, false, 0);
        const m = new Matrix();
        m.translate(offsetX, offsetY);
        screenshot._rawImage.draw(GLOBAL._layerMap, m, null, null, screenshot._rawImage.rect, true);
    }

    public static Process(brightness: number = 0, contrast: number = 0, saturation: number = 0, 
                          tiltShift: number = 0, noise: number = 0, border: number = 0): void {
        let cm: ColorMatrix;
        screenshot._processedImage = screenshot._rawImage.clone();

        if (brightness !== 0) {
            cm = new ColorMatrix();
            cm.adjustBrightness(brightness);
            screenshot._processedImage.applyFilter(screenshot._processedImage, screenshot._processedImage.rect, 
                screenshot._processedImage.rect.topLeft, new ColorMatrixFilter(cm.toArray()));
        }

        if (contrast !== 0) {
            cm = new ColorMatrix();
            cm.adjustContrast(contrast);
            screenshot._processedImage.applyFilter(screenshot._processedImage, screenshot._processedImage.rect,
                screenshot._processedImage.rect.topLeft, new ColorMatrixFilter(cm.toArray()));
        }

        if (saturation !== 0) {
            cm = new ColorMatrix();
            cm.adjustSaturation(saturation);
            screenshot._processedImage.applyFilter(screenshot._processedImage, screenshot._processedImage.rect,
                screenshot._processedImage.rect.topLeft, new ColorMatrixFilter(cm.toArray()));
        }

        if (tiltShift) {
            const blurHeight = 100 - tiltShift + 30;
            const centerPos = 50 + (100 - tiltShift + 30) / 2;
            const blurred = screenshot._processedImage.clone();
            blurred.applyFilter(blurred, blurred.rect, blurred.rect.topLeft, new BlurFilter(3, 3, 3));
            
            const gradMatrix = new Matrix();
            gradMatrix.createGradientBox(blurred.width, blurred.height * (blurHeight / 100), 
                90 / (180 / Math.PI), 0, blurred.height * ((centerPos - blurHeight) / 100));
            
            const maskSprite = new Sprite();
            maskSprite.graphics.beginGradientFill(GradientType.LINEAR, [0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF],
                [0, 1, 1, 0], [0, 85, 170, 255], gradMatrix);
            maskSprite.graphics.drawRect(0, 0, blurred.width, blurred.height);
            
            const maskBmp = new BitmapData(blurred.width, blurred.height, true, 0xFFFFFF);
            maskBmp.draw(maskSprite);
            blurred.copyPixels(screenshot._processedImage, screenshot._processedImage.rect,
                screenshot._processedImage.rect.topLeft, maskBmp, maskBmp.rect.topLeft, true);
            screenshot._processedImage = blurred;
        }

        if (noise > 0) {
            const noiseBmp = screenshot._rawImage.clone();
            noiseBmp.noise(1, 0, 255, 7, true);
            let ct = new ColorTransform(1, 1, 1, noise * 10 / 100);
            screenshot._processedImage.draw(noiseBmp, null, ct, BlendMode.MULTIPLY);
            ct = new ColorTransform(1, 1, 1, noise * 5 / 100);
            screenshot._processedImage.draw(noiseBmp, null, ct, BlendMode.SCREEN);
        }

        if (border) {
            if (border === 1) {
                screenshot._processedImage.copyPixels(new screenshot_border1(0, 0), 
                    screenshot._processedImage.rect, new Point(0, 0));
            }
            if (border === 2) {
                screenshot._processedImage.copyPixels(new screenshot_border2(0, 0),
                    screenshot._processedImage.rect, new Point(0, 0));
            }
            if (border === 3) {
                screenshot._processedImage.copyPixels(new screenshot_border3(0, 0),
                    screenshot._processedImage.rect, new Point(0, 0));
            }
        }
    }

    public static Show(): void {
        screenshot.Take(-20, -20);
        // POPUPS.Push(new screenshot_ui());
    }
}
