import BitmapData from "openfl/display/BitmapData";
import BlendMode from "openfl/display/BlendMode";
import DisplayObject from "openfl/display/DisplayObject";
import ColorTransform from "openfl/geom/ColorTransform";
import Matrix from "openfl/geom/Matrix";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

/**
 * HitTestBitmap - provides complex hit testing between display objects.
 */
export class HitTestBitmap {
    constructor() {
    }

    public static complexHitTestObject(object1: DisplayObject, object2: DisplayObject, accuracy: number = 1): boolean {
        return HitTestBitmap.complexIntersectionRectangle(object1, object2, accuracy).width !== 0;
    }

    public static intersectionRectangle(object1: DisplayObject, object2: DisplayObject): Rectangle {
        if (!object1.root || !object2.root || !object1.hitTestObject(object2)) {
            return new Rectangle();
        }
        const bounds1: Rectangle = object1.getBounds(object1.root);
        const bounds2: Rectangle = object2.getBounds(object2.root);
        const intersection: Rectangle = new Rectangle();
        intersection.x = Math.max(bounds1.x, bounds2.x);
        intersection.y = Math.max(bounds1.y, bounds2.y);
        intersection.width = Math.min(bounds1.x + bounds1.width - intersection.x, bounds2.x + bounds2.width - intersection.x);
        intersection.height = Math.min(bounds1.y + bounds1.height - intersection.y, bounds2.y + bounds2.height - intersection.y);
        return intersection;
    }

    public static complexIntersectionRectangle(object1: DisplayObject, object2: DisplayObject, accuracy: number = 1): Rectangle {
        if (accuracy <= 0) {
            throw new Error("ArgumentError: Error #5001: Invalid value for accuracy");
        }
        if (!object1.hitTestObject(object2)) {
            return new Rectangle();
        }
        const intersection: Rectangle = HitTestBitmap.intersectionRectangle(object1, object2);
        if (intersection.width * accuracy < 1 || intersection.height * accuracy < 1) {
            return new Rectangle();
        }
        const bitmapData: BitmapData = new BitmapData(intersection.width * accuracy, intersection.height * accuracy, false, 0);
        bitmapData.draw(object1, HitTestBitmap.getDrawMatrix(object1, intersection, accuracy), new ColorTransform(1, 1, 1, 1, 255, -255, -255, 255));
        bitmapData.draw(object2, HitTestBitmap.getDrawMatrix(object2, intersection, accuracy), new ColorTransform(1, 1, 1, 1, 255, 255, 255, 255), BlendMode.DIFFERENCE);
        let colorBounds: Rectangle = bitmapData.getColorBoundsRect(4294967295, 4278255615);
        bitmapData.dispose();
        if (accuracy !== 1) {
            colorBounds.x /= accuracy;
            colorBounds.y /= accuracy;
            colorBounds.width /= accuracy;
            colorBounds.height /= accuracy;
        }
        colorBounds.x += intersection.x;
        colorBounds.y += intersection.y;
        return colorBounds;
    }

    protected static getDrawMatrix(object: DisplayObject, rect: Rectangle, accuracy: number): Matrix {
        const rootMatrix: Matrix = object.root!.transform.concatenatedMatrix;
        const globalPoint: Point = object.localToGlobal(new Point());
        const matrix: Matrix = object.transform.concatenatedMatrix;
        matrix.tx = globalPoint.x - rect.x;
        matrix.ty = globalPoint.y - rect.y;
        matrix.a /= rootMatrix.a;
        matrix.d /= rootMatrix.d;
        if (accuracy !== 1) {
            matrix.scale(accuracy, accuracy);
        }
        return matrix;
    }
}
