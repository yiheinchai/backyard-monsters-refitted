import { BitmapData } from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/1565_smoke1_smoke1.png")]
@EmbedImage({ source: "/_assets/1565_smoke1_smoke1.png" })
export class smoke1 extends BitmapData {
    constructor(param1: number = 3000, param2: number = 30) {
        super(param1, param2);
    }
}
