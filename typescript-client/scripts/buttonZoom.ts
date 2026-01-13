import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buttonZoom")]
@Embed({ source: "/_assets/assets.swf", symbol: "buttonZoom" })
export class buttonZoom extends MovieClip {
    constructor() {
        super();
    }
}
