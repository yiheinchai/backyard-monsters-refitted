import BitmapData from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/2174_isograss2_isograss2.jpg")]
@EmbedImage({ source: "/_assets/2174_isograss2_isograss2.jpg" })
export class isograss2 extends BitmapData {
    constructor(param1: number = 200, param2: number = 100) {
        super(param1, param2);
    }
}
