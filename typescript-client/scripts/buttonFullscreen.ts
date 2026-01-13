import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buttonFullscreen")]
@Embed({ source: "/_assets/assets.swf", symbol: "buttonFullscreen" })
export class buttonFullscreen extends MovieClip {
    constructor() {
        super();
    }
}
