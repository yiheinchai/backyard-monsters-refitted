import BitmapData from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/2174_isograss5_isograss5.jpg")]
@EmbedImage({ source: "/_assets/2174_isograss5_isograss5.jpg" })
export class isograss5 extends BitmapData {
    constructor(param1: number = 200, param2: number = 100) {
        super(param1, param2);
    }
}
