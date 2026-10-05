package com.monsters.configs {

    /**
     * Options for the browser build of the client, which runs on Ruffle inside the PWA shell
     * served from server/public/play/.
     *
     * The shell passes these in as flashvars. When the client is loaded by the desktop launcher
     * none of them are present and every option keeps its launcher default.
     */
    public class WebPlatform {

        /** True when the client was started by the PWA shell (flashvar platform=web). */
        public static var isWeb:Boolean = false;

        /**
         * Draw the map through the display list instead of blitting everything into one BitmapData.
         * Ruffle draws on the GPU, so the blitting renderer's mix of draw() and copyPixels() forces a
         * GPU readback for every entry, every frame. Defaults to on for the browser build and can be
         * forced with the flashvar renderer=displaylist or renderer=bitmap.
         */
        public static var useDisplayList:Boolean = false;

        /**
         * Reads the web options from the SWF's flashvars. Must run before anything reads
         * BYMConfig.RENDERER_ON, as the map picks its renderer when it is first built.
         *
         * @param params The loaderInfo.parameters object of the root SWF.
         */
        public static function init(params:Object):void {
            if (!params) {
                return;
            }
            isWeb = params.platform == "web";
            useDisplayList = isWeb;

            if (params.renderer == "displaylist") {
                useDisplayList = true;
            }
            else if (params.renderer == "bitmap") {
                useDisplayList = false;
            }
        }
    }
}
