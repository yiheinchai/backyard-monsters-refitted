import { BitmapData } from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/2169_inferno_lava1_inferno_lava1.jpg")]
@EmbedImage({ source: "/_assets/2169_inferno_lava1_inferno_lava1.jpg" })
export class inferno_lava1 extends BitmapData {
    constructor(param1: number = 200, param2: number = 100) {
        super(param1, param2);
    }
}
