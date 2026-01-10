import BitmapData from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/2778_pin_shadow_pin_shadow.png")]
@EmbedImage({ source: "/_assets/2778_pin_shadow_pin_shadow.png" })
export class pin_shadow extends BitmapData {
    constructor(param1: number = 28, param2: number = 25) {
        super(param1, param2);
    }
}
