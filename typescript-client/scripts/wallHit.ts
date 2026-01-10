import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="wallHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "wallHit" })
export class wallHit extends MovieClip {
    constructor() {
        super();
    }
}
