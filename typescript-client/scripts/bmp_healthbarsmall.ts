import { BitmapData } from 'openfl/display/BitmapData';
import { Embed, EmbedImage } from "./core/Embed";
//    [Embed(source="/_assets/1667_bmp_healthbarsmall_bmp_healthbarsmall.png")]

@EmbedImage({ source: "/_assets/1667_bmp_healthbarsmall_bmp_healthbarsmall.png" })
export class bmp_healthbarsmall extends BitmapData {
    constructor(param1: number = 17, param2: number = 60) {
        super(param1, param2);
    }
}
