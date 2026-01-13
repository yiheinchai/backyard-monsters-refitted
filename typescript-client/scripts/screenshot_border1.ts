import BitmapData from "openfl/display/BitmapData";
import { Embed, EmbedImage } from "./core/Embed";

// [Embed(source="/_assets/2656_screenshot_border1_screenshot_border1.png")]
@EmbedImage({ source: "/_assets/2656_screenshot_border1_screenshot_border1.png" })
export class screenshot_border1 extends BitmapData {
    constructor(param1: number = 700, param2: number = 460) {
        super(param1, param2);
    }
}
