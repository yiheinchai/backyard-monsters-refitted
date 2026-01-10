import { BitmapData } from 'openfl/display/BitmapData';
import { Embed, EmbedImage } from "./core/Embed";
//    [Embed(source="/_assets/1816_bmd_burns_bmd_burns.png")]

@EmbedImage({ source: "/_assets/1816_bmd_burns_bmd_burns.png" })
export class bmd_burns extends BitmapData {
    constructor(param1: number = 320, param2: number = 40) {
        super(param1, param2);
    }
}
