import { BitmapData } from 'openfl/display/BitmapData';
import { Embed, EmbedImage } from "./core/Embed";
//    [Embed(source="/_assets/1704_bmp_healthbarlarge_bmp_healthbarlarge.png")]

@EmbedImage({ source: "/_assets/1704_bmp_healthbarlarge_bmp_healthbarlarge.png" })
export class bmp_healthbarlarge extends BitmapData {
    constructor(param1: number = 51, param2: number = 120) {
        super(param1, param2);
    }
}
