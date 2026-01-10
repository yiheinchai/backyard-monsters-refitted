import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="screenTransparent")]
@Embed({ source: "/_assets/assets.swf", symbol: "screenTransparent" })
export class screenTransparent extends MovieClip {
    public glare: MovieClip;
    public canvas: MovieClip;

    constructor() {
        super();
    }
}
