import BitmapData from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/2777_pushpins_pushpins.png")]
@EmbedImage({ source: "/_assets/2777_pushpins_pushpins.png" })
export class pushpins extends BitmapData {
    constructor(param1: number = 105, param2: number = 100) {
        super(param1, param2);
    }
}
