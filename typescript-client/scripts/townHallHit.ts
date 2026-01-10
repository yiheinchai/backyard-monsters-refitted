import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="townHallHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "townHallHit" })
export class townHallHit extends MovieClip {
    constructor() {
        super();
    }
}
