import { BitmapData } from 'openfl/display/BitmapData';
import { Embed, EmbedImage } from "./core/Embed";
//    [Embed(source="/_assets/1706_bmp_progressbarlarge_bmp_progressbarlarge.png")]

@EmbedImage({ source: "/_assets/1706_bmp_progressbarlarge_bmp_progressbarlarge.png" })
export class bmp_progressbarlarge extends BitmapData {
    constructor(param1: number = 51, param2: number = 300) {
        super(param1, param2);
    }
}
