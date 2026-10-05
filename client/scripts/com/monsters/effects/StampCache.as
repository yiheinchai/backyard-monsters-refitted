package com.monsters.effects {
    import flash.display.BitmapData;
    import flash.display.IBitmapDrawable;
    import flash.geom.Matrix;
    import flash.geom.Point;
    import flash.geom.Rectangle;

    /**
     * Rasterised copies of the vector effects (blood splats, dirt particles) that get stamped
     * onto the map's effects layer.
     *
     * The browser build runs on Ruffle, which draws vector art into a BitmapData on the GPU.
     * Copying that into the effects layer, which lives on the CPU, then reads it back from the
     * GPU and stalls rendering, once for every splat. Instead each variant is rasterised once,
     * ideally ahead of time on one sheet so that they all come back in a single readback, and
     * then reused.
     */
    public class StampCache {

        private static var _stamps:Object = {};

        /**
         * @param key Identifies the variant; the same key must always describe the same image.
         * @param width Width of the stamp.
         * @param height Height of the stamp.
         * @param source What to draw, already showing the right frame.
         * @param matrix How to draw it into the stamp.
         * @return The stamp, drawn on first use.
         */
        public static function Get(key:String, width:int, height:int, source:IBitmapDrawable, matrix:Matrix):BitmapData {
            var stamp:BitmapData = _stamps[key];
            if (!stamp) {
                stamp = new BitmapData(width, height, true, 0);
                stamp.draw(source, matrix);
                Download(stamp);
                _stamps[key] = stamp;
            }
            return stamp;
        }

        public static function Has(key:String):Boolean {
            return _stamps[key] != null;
        }

        /**
         * Adds a sheet of equally sized stamps, laid out left to right and top to bottom in the
         * order of their keys.
         */
        public static function AddSheet(sheet:BitmapData, keys:Array, width:int, height:int):void {
            var columns:int = sheet.width / width;
            var stamp:BitmapData = null;
            var i:int = 0;
            Download(sheet);
            while (i < keys.length) {
                stamp = new BitmapData(width, height, true, 0);
                stamp.copyPixels(sheet, new Rectangle(i % columns * width, int(i / columns) * height, width, height), new Point());
                _stamps[keys[i]] = stamp;
                i++;
            }
            sheet.dispose();
        }

        /**
         * Brings the pixels to the CPU now, where every later use reads them. Reading a single pixel
         * is not enough: only a read inside the drawn area waits for the GPU.
         */
        private static function Download(bitmap:BitmapData):void {
            bitmap.getPixels(bitmap.rect);
        }

        /**
         * Scales are quantised so that a handful of stamps cover the continuous range used.
         */
        public static function Quantise(value:Number, step:Number):Number {
            return Math.round(value / step) * step;
        }
    }
}
